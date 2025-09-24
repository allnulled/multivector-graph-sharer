// @code.start: LswNotes API | @$section: Vue.js (v2) Components » Lsw SchemaBasedForm API » LswNotes component
Vue.component("LswNotes", {
  template: $template,
  props: {
    autoDialog: {
      type: Boolean,
      default: () => false,
    },
    onAutoDialogSuccess: {
      type: Function,
      default: () => {},
    },
    onAutoDialogError: {
      type: Function,
      default: () => {},
    }
  },
  data() {
    this.$trace("lsw-notes.data");
    return {
      isLoaded: false,
      allNotes: false,
      openedNotes: [],
      notasButtons: [{
        text: "➕",
        event: () => {
          this.openAddNoteDialog();
        }
      }, {
        text: "🛜",
        event: () => {
          this.loadNotes();
        }
      }],
      currentError: this.error,
    };
  },
  methods: {
    setError(error = undefined) {
      this.$trace("lsw-notes.methods.setError");
      this.currentError = error;
    },
    toggleNote(noteId) {
      this.$trace("lsw-notes.methods.toggleNote");
      const pos = this.openedNotes.indexOf(noteId);
      if(pos === -1) {
        this.openedNotes.push(noteId);
      } else {
        this.openedNotes.splice(pos, 1);
      }
    },
    async loadNotes() {
      this.$trace("lsw-notes.methods.loadNotes");
      // *@TODO: seleccionar e importar notes.
      this.isLoaded = false;
      const notes = await this.$lsw.database.selectMany("Nota");
      const notesSorted = notes.sort((n1, n2) => {
        Segun_urgencia: {
          const e1 = n1.tiene_estado === 'urgente';
          const e2 = n2.tiene_estado === 'urgente';
          if(e1 && e2) {
            // @OK
          } else if(e1) {
            return -1;
          } else if(e2) {
            return 1;
          }
        }
        Segun_fecha: {
          const d1 = LswTimer.utils.getDateFromMomentoText(n1.tiene_fecha);
          const d2 = LswTimer.utils.getDateFromMomentoText(n2.tiene_fecha);
          if(d1 >= d2) return -1;
          return 1;
        }
      });
      this.allNotes = notesSorted;
      this.isLoaded = true;
    },
    editNote(nota) {
      this.$trace("lsw-notes.methods.editNote");
      const notasComponent = this;
      this.$lsw.dialogs.open({
        title: '💬 Editar nota',
        template: `
          <div>
            <lsw-schema-based-form
              :show-breadcrumb="false"
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
          data: { notaId: nota.id },
          methods: {
            async submitCallback(value) {
              this.$trace("Dialogs.EditarArticulo.methods.submitCallback");
              try {
                await this.$lsw.database.update("Nota", this.notaId, value);
                await this.$lsw.toasts.send({
                  title: "Nota actualizada correctamente",
                  text: "La nota ha sido actualizado con éxito."
                });
                this.close();
                notasComponent.loadNotes();
              } catch (error) {
                console.log(error);
                await this.$lsw.toasts.send({
                  title: "Error al actualizar nota",
                  text: "No se pudo actualizar la nota por un error: " + error.message,
                  background: "red",
                });
              }
            },
            async deleteCallback() {
              this.$trace("Dialogs.EditarArticulo.methods.deleteCallback");
              await this.$lsw.database.delete("Nota", this.notaId);
              this.close();
              notasComponent.loadNotes();
              await this.$lsw.toasts.send({
                title: "Nota eliminada correctamente",
                text: "La nota se eliminó con éxito.",
              });
            }
          }
        }
      });
    },
    async deleteNote(nota) {
      this.$trace("lsw-notes.methods.deleteNote");
      const confirmation = await this.$lsw.dialogs.open({
        title: "Eliminar nota",
        template: `
          <div>
            <p>¿Estás seguro de eliminar esta nota?</p>
            <pre>{{ JSON.stringify(nota, null, 2) }}</pre>
            <hr />
            <div class="flex_row">
              <div class="flex_100"></div>
              <div class="flex_1 pad_left_1">
                <button class="" v-on:click="accept">Aceptar</button>
              </div>
              <div class="flex_1 pad_left_1">
                <button class="" v-on:click="cancel">Cancelar</button>
              </div>
            </div>
          </div>
        `,
        factory: {
          data: {
            value: true,
            nota: nota,
          }
        }
      });
      if(confirmation !== true) {
        return;
      }
      await this.$lsw.database.delete("Nota", nota.id);
      await this.loadNotes();
    },
    async openAddNoteDialog() {
      this.$trace("lsw-notes.methods.openAddNoteDialog");
      const notasComponent = this;
      const response = await this.$lsw.dialogs.open({
        title: 'Insertando nota',
        template: `
          <lsw-schema-based-form
            :show-breadcrumb="false"
            :on-submit="(value) => submitCallback(value)"
            :model="{
                connection: $lsw.database,
                databaseId: 'lsw_default_database',
                tableId: 'Nota',
                rowId: -1,
            }"
          />
        `,
        factory: {
          methods: {
            async submitCallback(value) {
              this.$trace("Dialogs.EditarArticulo.methods.submitCallback");
              try {
                await this.$lsw.database.insert("Nota", value);
                await this.$lsw.toasts.send({
                  title: "Nota insertada correctamente",
                  text: "La nota ha sido insertada con éxito."
                });
                this.close();
                notasComponent.loadNotes();
              } catch (error) {
                console.log(error);
                await this.$lsw.toasts.send({
                  title: "Error al insertar nota",
                  text: "No se pudo actualizar el nota por un error: " + error.message,
                  background: "red",
                });
              }
            },
          }
        }
      })
      if(typeof response !== "object") {
        return;
      }
      await this.$lsw.database.insert("Nota", response);
      await this.loadNotes();
    }
  },
  watch: {},
  async mounted() {
    try {
      this.$trace("lsw-notes.mounted");
      await this.loadNotes();
      if(this.autoDialog) {
        this.openAddNoteDialog();
      }
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswNotes API