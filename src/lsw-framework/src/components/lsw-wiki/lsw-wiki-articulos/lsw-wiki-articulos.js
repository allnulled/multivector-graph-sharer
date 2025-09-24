// @code.start: LswWikiArticulos API | @$section: Vue.js (v2) Components » Lsw Wiki API » LswWikiArticulos component
Vue.component("LswWikiArticulos", {
  name: "LswWikiArticulos",
  template: $template,
  props: {},
  data() {
    this.$trace("lsw-wiki-articulos.data");
    return {
      articulos: false,
      isSearching: false,
      searchText: "",
      timeoutId: undefined,
      timeoutSeconds: 0.4,
      openedArticulos: [],
    };
  },
  methods: {
    async loadArticulos() {
      this.$trace("lsw-wiki-articulos.methods.loadArticulos");
      clearTimeout(this.searchTimeoutId);
      this.isSearching = true;
      const articulos = await (() => {
        if(this.searchText) {
          return this.$lsw.database.selectMany("Articulo", articulo => {
            return JSON.stringify(articulo).indexOf(this.searchText) !== -1;
          });
        } else {
          return this.$lsw.database.selectMany("Articulo");
        }
      })();
      const articulosOrdenados = articulos.sort((a1, a2) => {
        const f1 = a1.tiene_fecha || 0;
        const f2 = a2.tiene_fecha || 0;
        if(f1 < f2) return 1;
        if(f1 > f2) return -1;
        return -1;
      });
      this.openedArticulos = [];
      this.articulos = articulosOrdenados;
      this.isSearching = false;
    },
    loadArticulosDelayed() {
      this.$trace("lsw-wiki-articulos.methods.loadArticulosDelayed");
      clearTimeout(this.searchTimeoutId);
      this.isSearching = true;
      this.searchTimeoutId = setTimeout(() => {
        this.loadArticulos();
      }, 1000 * this.timeoutSeconds);
    },
    toggleArticulo(articuloId) {
      this.$trace("lsw-wiki-articulos.methods.toggleArticulo");
      const pos = this.openedArticulos.indexOf(articuloId);
      if(pos === -1) {
        this.openedArticulos.push(articuloId);
      } else {
        this.openedArticulos.splice(pos, 1);
      }
    },
    async createArticulo() {
      this.$trace("lsw-wiki-articulos.methods.createArticulo");
      const articulosComponent = this;
      await this.$dialogs.open({
        id: LswRandomizer.getRandomString(10),
        title: "Crear nuevo artículo",
        template: `
          <div>
            <lsw-schema-based-form
              :on-submit="submitCallback"
              :model="{
                  connection: $lsw.database,
                  databaseId: 'lsw_default_database',
                  tableId: 'Articulo',
                  rowId: -1,
              }"
            />
          </div>
        `,
        factory: {
          methods: {
            async submitCallback(value) {
              try {
                this.$trace("Dialogs.CrearNuevoArticulo.methods.submitCallback");
                await this.$lsw.database.insert("Articulo", value);
                await this.$lsw.toasts.send({
                  title: "Artículo añadido correctamente",
                  text: "El artículo ha sido añadido con éxito."
                });
                this.close();
                articulosComponent.loadArticulos();
              } catch (error) {
                console.log(error);
                await this.$lsw.toasts.send({
                  title: "Error al añadir artículo",
                  text: "No se pudo añadir el artículo por un error: " + error.message,
                  background: "red",
                });
              }

            }
          }
        }
      })
    },
    async editArticulo(articulo) {
      this.$trace("lsw-wiki-articulos.methods.editArticulo");
      const articulosComponent = this;
      await this.$lsw.dialogs.open({
        title: "🔬 Editar artículo",
        template: `
          <div>
            <lsw-schema-based-form
              :show-breadcrumb="false"
              :on-submit="(value) => submitCallback(value)"
              :on-delete-row="deleteCallback"
              :model="{
                  connection: $lsw.database,
                  databaseId: 'lsw_default_database',
                  tableId: 'Articulo',
                  rowId: articuloId,
              }"
            />
          </div>
        `,
        factory: {
          data: { articuloId: articulo.id },
          methods: {
            async submitCallback(value) {
              this.$trace("Dialogs.EditarArticulo.methods.submitCallback");
              try {
                await this.$lsw.database.update("Articulo", this.articuloId, value);
                await this.$lsw.toasts.send({
                  title: "Artículo actualizado correctamente",
                  text: "El artículo ha sido actualizado con éxito."
                });
                this.close();
                articulosComponent.loadArticulos();
              } catch (error) {
                console.log(error);
                await this.$lsw.toasts.send({
                  title: "Error al actualizar artículo",
                  text: "No se pudo actualizar el artículo por un error: " + error.message,
                  background: "red",
                });
              }
            },
            async deleteCallback() {
              this.$trace("Dialogs.EditarArticulo.methods.deleteCallback");
              this.close();
              articulosComponent.loadArticulos();
              await this.$lsw.toasts.send({
                title: "Artículo eliminado correctamente",
                text: "El artículo se eliminó con éxito.",
              });
            }
          }
        }
      });
      this.loadArticulos();
    }, 
    async deleteArticulo(articulo) {
      this.$trace("lsw-wiki-articulos.methods.deleteArticulo");
      const articulosComponent = this;
      const respuesta = await this.$lsw.dialogs.open({
        title: "Eliminar artículo",
        template: `
          <div class="pad_2">
            <div class="">¿Estás seguro que quieres eliminar el artículo?</div>
            <pre class="codeblock margin_top_2 margin_bottom_2">{{ articulo }}</pre>
            <hr />
            <div class="flex_row centered">
              <div class="flex_100"></div>
              <div class="flex_1 pad_right_1">
                <button class="flex_1" v-on:click="() => accept(true)">Aceptar</button>
              </div>
              <div class="flex_1">
                <button class="flex_1 " v-on:click="cancel">Cancelar</button>
              </div>
            </div>
          </div>
        `,
        factory: {
          data: { articulo },
          methods: {}
        }
      });
      if(respuesta !== true) return;
      await this.$lsw.database.delete("Articulo", articulo.id);
      this.$lsw.toasts.send({
        title: "Artículo eliminado correctamente",
        text: "El artículo fue eliminado correctamente"
      });
      this.loadArticulos();
    },
    async sendArticuloToNotas(articulo) {
      this.$trace("lsw-spontaneous-table-nota.methods.sendArticuloToNotas");
      const respuesta = await this.$lsw.dialogs.open({
        title: "Pasar artículo a notas",
        template: `
          <div class="pad_1">
            <div>Vas a pasar el siguiente artículo a nota: </div>
            <div class="pad_2">
              <pre class="codeblock">{{ articulo }}</pre>
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
        factory: { data: { articulo } },
      });
      if(respuesta === -1) return;
      const notaNew = Object.assign({
        tiene_titulo: '',
        tiene_fecha: '',
        tiene_estado: "creada",
        tiene_categorias: '',
        tiene_contenido: '',
        tiene_garantia: '',
        tiene_tags: '',
      }, articulo);
      delete notaNew.id;
      await this.$lsw.database.insert("Nota", notaNew);
      await this.$lsw.database.delete("Articulo", articulo.id);
      this.$lsw.toasts.send({
        title: "Artículo a nota bien",
        text: "El artículo ha sido pasado a nota correctamente",
      });
      this.loadArticulos();
    }
  },
  watch: {
    
  },
  async mounted() {
    try {
      this.$trace("lsw-wiki-articulos.mounted");
      await this.loadArticulos();
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswWikiArticulos API