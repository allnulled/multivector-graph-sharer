// @code.start: LswSpontaneousTableNota API | @$section: Módulo org.allnulled.lsw-conductometria » Vue.js (v2) Components » LswSpontaneousTableNota API » LswSpontaneousTableNota component
Vue.component("LswSpontaneousTableNota", {
  template: $template,
  props: {},
  data() {
    this.$trace("lsw-spontaneous-table-nota.data");
    return {
      allNotas: false,
      currentNotas: false,
      currentPage: 0,
      totalPages: 0,
      currentItemsPerPage: 100,
      searchText: '',
      selectedNotas: [],
    };
  },
  methods: {
    toggleNota(notaId) {
      this.$trace("lsw-spontaneous-table-nota.methods.toggleNota");
      const pos = this.selectedNotas.indexOf(notaId);
      if (pos === -1) {
        this.selectedNotas.push(notaId);
      } else {
        this.selectedNotas.splice(pos, 1);
      }
    },
    goToNextPage() {
      this.$trace("lsw-spontaneous-table-nota.methods.goToNextPage");
      if ((this.currentPage + 1) < this.totalPages) {
        this.currentPage++;
        this.synchronizePagination();
      }
    },
    goToFirstPage() {
      this.$trace("lsw-spontaneous-table-nota.methods.goToFirstPage");
      this.currentPage = 0;
      this.synchronizePagination();
    },
    goToLastPage() {
      this.$trace("lsw-spontaneous-table-nota.methods.goToLastPage");
      this.currentPage = (this.totalPages - 1);
      this.synchronizePagination();
    },
    goToPreviousPage() {
      this.$trace("lsw-spontaneous-table-nota.methods.goToPreviousPage");
      if (this.currentPage > 0) {
        this.currentPage--;
        this.synchronizePagination();
      }
    },
    async loadNotes() {
      this.$trace("lsw-spontaneous-table-nota.methods.loadNotes");
      const allNotas = await this.$lsw.database.selectMany("Nota");
      const sortedNotas = allNotas.filter(nota => {
        if(this.searchText === '') {
          return true;
        }
        return JSON.stringify(nota).toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1;
      }).sort((n1, n2) => {
        Ordena_por_urgencia: {
          const estado1 = n1.tiene_estado;
          const estado2 = n2.tiene_estado;
          const urgencia1 = estado1 === "urgente" ? 100 : 1;
          const urgencia2 = estado2 === "urgente" ? 100 : 1;
          if (urgencia1 > urgencia2) {
            return -1;
          } else if (urgencia1 < urgencia2) {
            return 1;
          }
        }
        Ordena_por_fecha: {
          const fecha1 = LswTimer.utils.fromDatestringToDate(n1.tiene_fecha);
          const fecha2 = LswTimer.utils.fromDatestringToDate(n2.tiene_fecha);
          if (fecha1 > fecha2) {
            return -1;
          } else if (fecha1 < fecha2) {
            return 1;
          } else {
            return -1;
          }
        }
      });
      this.allNotas = sortedNotas;
      this.synchronizePagination();
    },
    synchronizePagination() {
      this.$trace("lsw-spontaneous-table-nota.methods.synchronizePagination");
      this.totalPages = (() => {
        const totalFullPages = Math.floor(this.allNotas.length / this.currentItemsPerPage);
        const totalResidualPages = this.allNotas.length % this.currentItemsPerPage ? 1 : 0;
        return totalFullPages + totalResidualPages;
      })();
      this.currentNotas = (() => {
        const paginatedNotas = [];
        const minIndex = this.currentPage * this.currentItemsPerPage;
        const maxIndex = (this.currentPage + 1) * this.currentItemsPerPage;
        for (let index = 0; index < this.allNotas.length; index++) {
          const nota = this.allNotas[index];
          const validByMin = index >= minIndex;
          const validByMax = index < maxIndex;
          const isValid = validByMin && validByMax;
          if (isValid) {
            paginatedNotas.push(nota);
          }
        }
        return paginatedNotas;
      })();
    },
    async goToDeleteNota(row) {
      this.$trace("lsw-spontaneous-table-nota.methods.goToDeleteNota");
      const confirmed = await this.$lsw.dialogs.open({
        id: `eliminar-registro-Nota-#${row.id}-${LswRandomizer.getRandomString(5)}`,
        title: "Eliminar registro",
        template: `
          <div>
            <div class="pad_2 font_weight_bold">ATENCIÓN: </div>
            <div class="pad_2">¿Seguro que quieres eliminar el registro <b>{{ tableId }}</b> cuyo <b>id</b>#<b>{{ rowId }}</b>?</div>
            <div class="pad_2">
              <pre class="pad_2 codeblock">{{ JSON.stringify(rowValue, null, 2) }}</pre>
            </div>
            <hr class="margin_0" />
            <div class="pad_2 text_align_right">
              <button class="supermini danger_button" v-on:click="() => accept(true)">Eliminar</button>
              <button class="supermini " v-on:click="() => accept(false)">Cancelar</button>
            </div>
          </div>
        `,
        factory: {
          data: {
            tableId: "Nota",
            rowValue: row,
            rowId: row.id
          }
        }
      });
      if (!confirmed) return false;
      await this.$lsw.database.delete("Nota", row.id);
      this.$lsw.toasts.send({
        title: `Registro eliminado`,
        text: `El registro #${this.notaId} de «Nota» fue eliminado correctamente.`
      });
      this.loadNotes();
    },
    async goToEditNota(notaId) {
      this.$trace("lsw-spontaneous-table-nota.methods.goToEditNota");
      await this.$lsw.dialogs.open({
        title: "Actualizar nota",
        template: `
          <div>
            <lsw-schema-based-form
              :on-submit="(value) => submitCallback(value)"
              :on-delete-row="deleteCallback"
              :model="{
                  connection: $lsw.database,
                  databaseId: 'lsw_default_database',
                  tableId: 'Nota',
                  rowId: notaId,
              }"
            />
          </div>
        `,
        factory: {
          methods: {
            async submitCallback(value) {
              console.log("Submiting form: ", value);
              await this.$lsw.database.update("Nota", notaId, value);
              this.$lsw.toasts.send({
                title: `Nueva actualización`,
                text: `El registro #${this.notaId} de «Nota» fue actualizado correctamente.`
              });
              this.close();
            },
            async deleteCallback() {
              // EL DELETE YA LO HACE DENTRO, POR ALGUNA RAZÓN, NO ME ACABES DE PREGUNTAR.
              this.close();
            }
          },
          data: {
            notaId,
          }
        }
      });
    },
    goToAddNota() {
      this.$trace("lsw-spontaneous-table-nota.methods.goToEditNota");
      const that = this;
      this.$lsw.dialogs.open({
        title: "Añadir nota",
        template: `<lsw-spontaneous-form-nota :on-submitted="closeAndRefresh" />`,
        factory: {
          methods: {
            closeAndRefresh() {
              this.close();
              that.loadNotes();
            }
          }
        }
      });
    },
    async sendNotaToArticulos(nota) {
      this.$trace("lsw-spontaneous-table-nota.methods.sendNotaToArticulos");
      const respuesta = await this.$lsw.dialogs.open({
        title: "Pasar nota a artículo",
        template: `
          <div class="pad_1">
            <div>Vas a pasar la siguiente nota a artículo: </div>
            <div class="pad_2">
              <pre class="codeblock">{{ nota }}</pre>
            </div>
            <div>¿Estás seguro?</div>
            <hr/>
            <div class="flex_row centered text_align_right">
              <div class="flex_100"></div>
              <div class="flex_1 pad_right_1">
                <button class="supermini danger_button" v-on:click="accept">Aceptar</button>
              </div>
              <div class="flex_1">
                <button class="supermini" v-on:click="cancel">Cancelar</button>
              </div>
            </div>
          </div>
        `,
        factory: { data: { nota } },
      });
      if(respuesta === -1) return;
      const articuloNew = Object.assign({
        tiene_titulo: '',
        tiene_fecha: '',
        tiene_categorias: '',
        tiene_contenido: '',
        tiene_garantia: '',
        tiene_tags: '',
      }, nota);
      delete articuloNew.id;
      await this.$lsw.database.insert("Articulo", articuloNew);
      await this.$lsw.database.delete("Nota", nota.id);
      this.$lsw.toasts.send({
        title: "Nota a artículo bien",
        text: "La nota ha sido pasada a artículo correctamente",
      });
      this.loadNotes();
    }
  },
  watch: {},
  mounted() {
    try {
      this.$trace("lsw-spontaneous-table-nota.mounted");
      this.loadNotes();
      this.$window.sptt_notas = this;
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswSpontaneousTableNota API