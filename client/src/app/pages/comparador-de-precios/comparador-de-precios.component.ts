import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IndecService, Supermercado, ComparadorRow } from '@/app/services/indec.service';
import { CartCodesService } from '@/app/services/cart-codes.service';
import { LocalizacionStore } from '@/app/store/localizacion.store';

type VmRow = ComparadorRow & {
  pricesBySup: Record<number, any>; // RAW, sin parsear
  min: number | null;               // mínimo numérico para resaltar (siempre que sea number)
};

@Component({
  selector: 'app-comparador-precios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comparador-de-precios.component.html'
})
export class ComparadorPreciosComponent {
  loading = false;
  errorMsg: string | null = null;

  supermercados: Supermercado[] = [];

  // columnas (supermercados)
  colIds: number[] = [];

  // filas listas para render
  vmRows: VmRow[] = [];

  // totales por supermercado y el más barato
  totalBySup: Record<number, number> = {};
  cheapestSupId: number | null = null;

  supName = (id: number) => {
    const s = this.supermercados.find(x => x.nroSupermercado === id);
    return s?.razonSocial ?? `Super ${id}`;
  };

  constructor(
    private indec: IndecService,
    public cart: CartCodesService,
    public locStore: LocalizacionStore
  ) {}

  ngOnInit() {
    // Traigo supermercados (para nombres y para columnas si querés forzar 4 columnas)
    this.indec.getSupermercados().subscribe({
      next: ss => {
        this.supermercados = ss ?? [];
        // Si querés mostrar SIEMPRE todos los supers (aunque no venga precio), descomentá:
        // this.colIds = this.supermercados.map(s => s.nroSupermercado).sort((a, b) => a - b);
      },
      error: () => {
        this.supermercados = [];
      },
    });

    this.comparar();
  }

  comparar() {
    const loc = this.locStore.localidad();
    const nroLocalidad = loc?.nroLocalidad ?? 0;
    const codes = this.cart.codes();

    this.errorMsg = null;

    if (!nroLocalidad) {
      this.errorMsg = 'Seleccioná una localidad desde el navbar.';
      this.resetTable();
      return;
    }
    if (!codes.length) {
      this.errorMsg = 'Tu carrito está vacío. Agregá productos para comparar.';
      this.resetTable();
      return;
    }

    this.loading = true;

    this.indec.compareByLocalidad(nroLocalidad, codes).subscribe({
      next: data => {
        const rows = data ?? [];

        // Columnas: por defecto, salen de lo que viene en ofertas
        // (Si querés siempre 4 supers, setea colIds desde supermercados en ngOnInit y NO lo pises acá)
        this.colIds = this.buildColIds(rows);

        // armo vmRows con precios RAW
        this.vmRows = rows.map(r => {
          const pricesBySup: Record<number, any> = {};

          // inicializo
          for (const id of this.colIds) pricesBySup[id] = null;

          // lleno con lo que venga
          for (const o of (r.ofertas ?? [])) {
            const id = Number(o.nroSupermercado);
            if (Number.isFinite(id)) pricesBySup[id] = o.precio; // RAW
          }

          // mínimo por fila (solo considera números reales)
          const numeric = Object.values(pricesBySup).filter((v): v is number => typeof v === 'number');
          const min = numeric.length ? Math.min(...numeric) : null;

          return { ...r, pricesBySup, min };
        });

        this.computeTotals();

        this.loading = false;
      },
      error: err => {
        this.errorMsg = err?.message || 'Error al cargar la comparación.';
        this.resetTable();
        this.loading = false;
      }
    });
  }

  private resetTable() {
    this.vmRows = [];
    this.colIds = [];
    this.totalBySup = {};
    this.cheapestSupId = null;
    this.loading = false;
  }

  private buildColIds(rows: ComparadorRow[]): number[] {
    const set = new Set<number>();
    for (const r of rows) {
      for (const o of (r.ofertas ?? [])) {
        const id = Number(o.nroSupermercado);
        if (Number.isFinite(id)) set.add(id);
      }
    }
    return Array.from(set).sort((a, b) => a - b);
  }

  private computeTotals() {
    this.totalBySup = {};
    for (const id of this.colIds) this.totalBySup[id] = 0;

    for (const r of this.vmRows) {
      for (const id of this.colIds) {
        const v = r.pricesBySup[id];
        if (typeof v === 'number') this.totalBySup[id] += v;
      }
    }

    let min = Infinity;
    let minId: number | null = null;

    for (const id of this.colIds) {
      const total = this.totalBySup[id] ?? 0;
      // si querés evitar que gane uno con total 0 por falta de precios, avisame y lo ajusto
      if (total < min) {
        min = total;
        minId = id;
      }
    }

    this.cheapestSupId = minId;
  }

  trackCol = (_: number, id: number) => id;
  trackRow = (_: number, r: VmRow) => r.codBarra;
}
