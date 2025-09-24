// @code.start: LswKeyboard1Text API | @$section: Vue.js (v2) Components » LswKeyboard1Text component
(function () {

  
  const keyEvents = {
    "DefaultAction": function (event) {
      this.injectCharacter(event.key);
    },
    "Backspace": function () {
      this.deleteSelectionOrCharacter(true);
    },
    "Delete": function () {
      this.deleteSelectionOrCharacter(false);
    },
    "Enter": function () {
      this.injectCharacter("\n");
    },
    "Control": function () {

    },
    "Shift": function () {

    },
    "ArrowLeft": function (event) {
      if (event.ctrlKey) {
        if (event.shiftKey) {
          this.dragCursorWordLeft();
        } else {
          this.moveCursorWordLeft();
        }
      } else if (event.shiftKey) {
        this.dragCursorCharacterLeft();
      } else {
        this.moveCursorHorizontally(-1);
      }
    },
    "ArrowRight": function (event) {
      if (event.ctrlKey) {
        if (event.shiftKey) {
          this.dragCursorWordRight();
        } else {
          this.moveCursorWordRight();
        }
      } else if (event.shiftKey) {
        this.dragCursorCharacterRight();
      } else {
        this.moveCursorHorizontally(1);
      }
    },
    "ArrowUp": function (event) {
      if (event.shiftKey) {
        this.dragCursorLineUp();
      } else {
        this.moveCursorVertically(-1);
      }
    },
    "ArrowDown": function (event) {
      if (event.shiftKey) {
        this.dragCursorLineDown();
      } else {
        this.moveCursorVertically(1);
      }
    },
    "Home": function (event) {
      if (event.shiftKey) {
        this.dragCursorToLineStart();
      } else {
        this.moveCursorToLineStart();
      }
    },
    "End": function (event) {
      if (event.shiftKey) {
        this.dragCursorToLineEnd();
      } else {
        this.moveCursorToLineEnd();
      }
    },
    "PageUp": function (event) {
      if (event.ctrlKey) {
        this.scrollPageUp();
      } else if (event.shiftKey) {
        this.dragCursorToPageUp();
      } else {
        this.moveCursorToPageUp();
      }
    },
    "PageDown": function (event) {
      if (event.ctrlKey) {
        this.scrollPageDown();
      } else if (event.shiftKey) {
        this.dragCursorToPageDown();
      } else {
        this.moveCursorToPageDown();
      }
    },

  };
  let cursorLine = 0;
  let cursorColumn = 0;
  Vue.component("LswKeyboard1Text", {
    template: $template,
    props: {
      text: {
        type: Array,
        required: true,
      },
      keyboard: {
        type: Object,
        required: true,
      }
    },
    data() {
      this.$trace("lsw-keyboard-1-text.data");
      let pos = 0;
      return {
        currentText: this.text,
        pageUpDownLines: 20,
        textMatrix: this.getTextMatrix(this.text),
        cursorStart: 0,
        cursorEnd: 0,
        cursorPosition: 0,
        cursorLine: 0,
        cursorColumn: 0,
      };
    },
    methods: {
      getTextMatrix(text = this.currentText) {
        this.$trace("lsw-keyboard-1-text.methods.getTextMatrix");
        let pos = 0;
        return text.split(/\n/g).map(line => line.split("").map(ch => {
          return {
            ch,
            pos: pos++
          }
        }).concat([{
          ch: "\n",
          pos: pos++,
        }]));
      },
      getTextFromMatrix(matrix = this.textMatrix) {
        this.$trace("lsw-keyboard-1-text.methods.getTextFromMatrix");
        return matrix.map(line => line.join("")).join("");
      },
      synchronizeTextFromMatrix() {
        this.$trace("lsw-keyboard-1-text.methods.synchronizeMatrixFromText");
        this.currentText = this.getTextFromMatrix(this.textMatrix);
      },
      synchronizeMatrixFromText() {
        this.$trace("lsw-keyboard-1-text.methods.synchronizeMatrixFromText");
        this.textMatrix = this.getTextMatrix(this.currentText);
      },
      isSelectedPosition(textPos) {
        this.$trace("lsw-keyboard-1-text.methods.isSelectedPosition");
        return (this.cursorStart <= textPos) && (this.cursorEnd > textPos);
      },
      hasSelectedRange() {
        return this.cursorStart !== this.cursorEnd;
      },
      setSelectedPosition(startPos, endPos = startPos, cursorPos = false) {
        this.$trace("lsw-keyboard-1-text.methods.setSelectedPosition");
        this.cursorStart = startPos;
        this.cursorEnd = endPos;
        if (typeof cursorPos === "number") {
          this.cursorPosition = cursorPos;
        } else {
          this.cursorPosition = this.cursorStart;
        }
        HOOKS_PARA_CADA_MOVIMIENTO_DEL_CURSOR_POR_EL_TEXTO: {
          this.synchronizeCursorPath();
        }
      },
      synchronizeCursorPath() {
        this.$trace("lsw-keyboard-1-text.methods.synchronizeCursorPath");
        let currentPos = 0;
        Iterating_text:
        for(let lineIndex=0; lineIndex<this.textMatrix.length; lineIndex++) {
          const line = this.textMatrix[lineIndex];
          const finalLinePos = currentPos + (line.length);
          if(finalLinePos > this.cursorPosition) {
            for(let columnIndex=0; columnIndex<line.length; columnIndex++) {
              const cell = line[columnIndex];
              if(cell.pos === this.cursorPosition) {
                this.cursorLine = lineIndex;
                this.cursorColumn = columnIndex;
                break Iterating_text;
              }
            }
          } else if(finalLinePos === this.cursorPosition) {
            this.cursorLine = lineIndex;
            this.cursorColumn = line.length;
            break Iterating_text;
          } else {
            currentPos = finalLinePos;
          }
          currentPos++;
        }
        
      },
      setFocusToKeyboard() {
        this.$trace("lsw-keyboard-1-text.methods.setFocusToKeyboard");
        this.keyboard.gainFocus();
      },
      onKeyClicked(textPos) {
        this.$trace("lsw-keyboard-1-text.methods.onKeyClicked");
        this.setSelectedPosition(textPos);
        this.setFocusToKeyboard();
      },
      moveCursorHorizontally(movement) {
        this.$trace("lsw-keyboard-1-text.methods.moveCursorHorizontally");
        if (this.hasSelectedRange()) {
          if (movement < 0) {
            this.setSelectedPosition(this.cursorStart);
          } else {
            this.setSelectedPosition(this.cursorEnd);
          }
        } else {
          if (movement < 0) {
            if (this.cursorStart === 0) {
              return false;
            }
          } else if (movement > 0) {
            if (this.cursorEnd >= this.currentText.length) {
              return false;
            }
          }
          this.setSelectedPosition(this.cursorStart + movement);
        }
      },
      getCursorPosition() {
        this.$trace("lsw-keyboard-1-text.methods.getCursorPosition");
        const currentKey = this.$refs.cursor[0];
        const pos = parseInt(currentKey.getAttribute("data-cursor-position"));
        const line = parseInt(currentKey.getAttribute("data-cursor-line"));
        const ch = parseInt(currentKey.getAttribute("data-cursor-character"));
        return { pos, line, ch };
      },
      setCursorPath(lineIndex, columnIndex) {
        this.$trace("lsw-keyboard-1-text.methods.setCursorPath");
        cursorLine = lineIndex;
        cursorColumn = columnIndex;
        return true;
      },
      getCursorPath() {
        this.$trace("lsw-keyboard-1-text.methods.getCursorPath");
        return {
          line: cursorLine,
          column: cursorColumn
        }
      },
      moveCursorVertically(movement) {
        this.$trace("lsw-keyboard-1-text.methods.moveCursorVertically");
        const { pos, line, ch } = this.getCursorPosition();
        const goesUp = movement < 0;
        if ((line === 0) && (goesUp)) {
          return false;
        }
        if ((line === this.textMatrix.length) && (!goesUp)) {
          return false;
        }
        let nextPosition = undefined;
        let nextLine = undefined;
        let nextColumn = ch;
        Calculate_next_line: {
          nextLine = line + movement;
        }
        Calculate_next_column: {
          const nextLineArray = this.textMatrix[nextLine];
          if (!nextLineArray) {
            return false;
          }
          if (nextLineArray.length <= ch) {
            nextColumn = nextLineArray.length - 1;
          }
        }
        Calculate_next_position: {
          nextPosition = this.textMatrix[nextLine][nextColumn].pos;
        }
        this.setSelectedPosition(nextPosition);
      },
      dispatchKeyPress(keyId, event) {
        this.$trace("lsw-keyboard-1-text.methods.dispatchKeyPress");
        const keyEvent = keyId in keyEvents ? keyEvents[keyId] : keyEvents.DefaultAction;
        event.preventDefault();
        return keyEvent.call(this, event);
      },
      moveCursorToLineStart() {
        this.$trace("lsw-keyboard-1-text.methods.moveCursorToLineStart");
        const { pos, line, ch } = this.getCursorPosition();
        this.setSelectedPosition(this.textMatrix[line][0].pos);
      },
      moveCursorToLineEnd() {
        this.$trace("lsw-keyboard-1-text.methods.moveCursorToLineEnd");
        const { pos, line, ch } = this.getCursorPosition();
        const currentLineArray = this.textMatrix[line];
        this.setSelectedPosition(currentLineArray[currentLineArray.length - 1].pos);
      },
      getLineUpPosition(cursor = this.getCursorPosition()) {
        this.$trace("lsw-keyboard-1-text.methods.getLineUpPosition");
        const { line, ch, pos } = cursor;
        if(line === 0) {
          // CASO 1: si no hay línea anterior, el cursor va al inicio
          return 0;
        }
        const nextLineArray = this.textMatrix[line-1];
        if(ch > nextLineArray.length) {
          // CASO 2: si sí hay línea anterior, pero no caracter: va al final de la linea anterior
          return nextLineArray[nextLineArray.length - 1].pos;
        } else {
          // CASO 3: si sí hay línea anterior, y sí hay caracter: normal
          return nextLineArray[ch].pos;
        }
      },
      getLineDownPosition(cursor = this.getCursorPosition()) {
        this.$trace("lsw-keyboard-1-text.methods.getLineDownPosition");
        const { line, ch, pos } = cursor;
        if(line === (this.textMatrix.length-1)) {
          // CASO 1: si no hay línea posterior, el cursor va al final
          return this.currentText.length - 1;
        }
        const nextLineArray = this.textMatrix[line+1];
        if(ch > nextLineArray.length) {
          // CASO 2: si sí hay línea posterior, pero no caracter: va al final de la linea posterior
          return nextLineArray[nextLineArray.length - 1].pos;
        } else {
          // CASO 3: si sí hay línea posterior, y sí hay caracter: normal
          return nextLineArray[ch].pos;
        }
      },
      getWordLeftPosition() {
        this.$trace("lsw-keyboard-1-text.methods.moveCursorWordRight");
        const { pos, line, ch } = this.getCursorPosition();
        const currentLineArray = this.textMatrix[line];
        const firstPosition = ch - 2;
        if (firstPosition < 0) {
          return pos;
        }
        for (let index = firstPosition; index >= 0; index--) {
          const currentCh = currentLineArray[index];
          if ([" ", ".", ","].indexOf(currentCh.ch) !== -1) {
            return currentLineArray[index].pos + 1;
          }
        }
        return currentLineArray[0].pos;
      },
      getWordRightPosition() {
        this.$trace("lsw-keyboard-1-text.methods.moveCursorWordRight");
        const { pos, line, ch } = this.getCursorPosition();
        const currentLineArray = this.textMatrix[line];
        for (let index = ch + 1; index < currentLineArray.length; index++) {
          const currentCh = currentLineArray[index];
          if ([" ", ".", ","].indexOf(currentCh.ch) !== -1) {
            return currentLineArray[index].pos;
          }
        }
        return currentLineArray[currentLineArray.length - 1].pos;
      },
      moveCursorWordLeft() {
        this.$trace("lsw-keyboard-1-text.methods.moveCursorWordLeft");
        const newPos = this.getWordLeftPosition();
        return this.setSelectedPosition(newPos);
      },
      moveCursorWordRight() {
        this.$trace("lsw-keyboard-1-text.methods.moveCursorWordRight");
        const newPos = this.getWordRightPosition();
        return this.setSelectedPosition(newPos);
      },
      moveCursorToPageUp() {
        this.$trace("moveCursorToPageUp");
        // @BYCHATGPT:
        const { line, ch } = this.getCursorPosition();
        const targetLine = Math.max(0, line - this.pageUpDownLines);
        const col = Math.min(ch, this.textMatrix[targetLine].length - 1);
        const pos = this.textMatrix[targetLine][col].pos;
        this.setSelectedPosition(pos);
      },
      moveCursorToPageDown() {
        this.$trace("moveCursorToPageDown");
        // @BYCHATGPT:
        const { line, ch } = this.getCursorPosition();
        const targetLine = Math.min(this.textMatrix.length - 1, line + this.pageUpDownLines);
        const col = Math.min(ch, this.textMatrix[targetLine].length - 1);
        const pos = this.textMatrix[targetLine][col].pos;
        this.setSelectedPosition(pos);
      },
      dragCursorCharacterLeft() {
        this.$trace("dragCursorCharacterLeft");
        // @BYME:
        if (this.hasSelectedRange()) {
          if (this.cursorStart === this.cursorPosition) {
            if (this.cursorStart > 0) {
              const finalPos = this.cursorStart - 1;
              this.setSelectedPosition(finalPos, this.cursorEnd, finalPos);
            }
          } else if (this.cursorEnd === this.cursorPosition) {
            if (this.cursorEnd > 0) {
              const finalPos = this.cursorEnd - 1;
              this.setSelectedPosition(this.cursorStart, finalPos, finalPos);
            }
          }
        } else {
          if (this.cursorStart > 0) {
            const finalPos = this.cursorStart - 1;
            this.setSelectedPosition(finalPos, this.cursorEnd, finalPos);
          }
        }
      },
      dragCursorCharacterRight() {
        this.$trace("dragCursorCharacterRight");
        // @BYME:
        if (this.hasSelectedRange()) {
          if (this.cursorStart === this.cursorPosition) {
            if (this.cursorStart < (this.currentText.length - 1)) {
              const finalPos = this.cursorStart + 1;
              this.setSelectedPosition(finalPos, this.cursorEnd, finalPos);
            }
          } else if (this.cursorEnd === this.cursorPosition) {
            if (this.cursorEnd < (this.currentText.length - 1)) {
              const finalPos = this.cursorEnd + 1;
              this.setSelectedPosition(this.cursorStart, finalPos, finalPos);
            }
          }
        } else {
          if (this.cursorEnd < (this.currentText.length - 1)) {
            const finalPos = this.cursorEnd + 1;
            this.setSelectedPosition(this.cursorStart, finalPos, finalPos);
          }
        }
      },
      dragCursorWordRight() {
        this.$trace("dragCursorWordRight");
        // @BYME:
        const { line, ch, pos } = this.getCursorPosition();
        const newPos = this.getWordRightPosition();
        if (pos === this.cursorEnd) {
          // CASO 1: Cuando el nuevo cursor coincide con el end: solo movemos el end
          this.setSelectedPosition(this.cursorStart, newPos, newPos);
        } else {
          if (newPos > this.cursorEnd) {
            // CASO 2: Cuando el nuevo cursor es mayor que el end: 
            return this.setSelectedPosition(this.cursorEnd, newPos, newPos);
          } else {
            // CASO 2: Cuando el nuevo cursor es menor que el end: 
            return this.setSelectedPosition(newPos, this.cursorEnd, newPos);
          }
        }
      },
      dragCursorWordLeft() {
        this.$trace("dragCursorWordLeft");
        // @BYME:
        const { line, ch, pos } = this.getCursorPosition();
        const newPos = this.getWordLeftPosition();
        if (pos === this.cursorStart) {
          // CASO 1: Cuando el nuevo cursor coincide con el start: solo movemos el start
          this.setSelectedPosition(newPos, this.cursorEnd, newPos);
        } else if (newPos < this.cursorStart) {
          // CASO 2: Cuando el nuevo cursor es menor que el start: 
          return this.setSelectedPosition(newPos, this.cursorStart, newPos);
        } else {
          // CASO 3: Cuando el nuevo cursor es mayor al start: 
          return this.setSelectedPosition(this.cursorStart, newPos, newPos);
        }
      },
      dragCursorLineUp() {
        this.$trace("dragCursorLineUp");
        // @BYME:
        const { line, ch, pos } = this.getCursorPosition();
        const newPos = this.getLineUpPosition();
        if(this.cursorStart === pos) {
          // CASO 1: si movemos desde el start (para arriba)
          return this.setSelectedPosition(newPos, this.cursorEnd, newPos);
        } else if(this.cursorEnd === pos) {
          // CASO 2: si movemos desde el end
          if(newPos <= this.cursorStart) {
            return this.setSelectedPosition(newPos, this.cursorStart, newPos);
          } else {
            return this.setSelectedPosition(this.cursorStart, newPos, newPos);
          }
        }
      },
      dragCursorLineDown() {
        this.$trace("dragCursorLineDown");
        // @BYME:
        const { line, ch, pos } = this.getCursorPosition();
        const newPos = this.getLineDownPosition();
        if(this.cursorStart === pos) {
          // CASO 1: si movemos desde el start (para abajo)
          if(newPos > this.cursorEnd) {
            // CASO 2: si la nueva posición está después del end: movemos el end, y el start donde el end
            return this.setSelectedPosition(this.cursorEnd, newPos, newPos);
          } else if(newPos <= this.cursorEnd) {
            // CASO 3: si la nueva posición está antes del end: movemos el start
            return this.setSelectedPosition(newPos, this.cursorEnd, newPos);
          }
        } else if(this.cursorEnd === pos) {
          // CASO 4: si movemos desde el end
          return this.setSelectedPosition(this.cursorStart, newPos, newPos);
        }
      },
      dragCursorToLineStart() {
        this.$trace("dragCursorToLineStart");
        // @BYME:
        const { line, ch, pos } = this.getCursorPosition();
        const newPos = this.textMatrix[line][0].pos;
        if (pos <= this.cursorStart) {
          // CASO 1: Cuando el viejo cursor está antes o igual que el start:
          return this.setSelectedPosition(newPos, this.cursorEnd, newPos);
        } else {
          // CASO 2: Cuando el viejo cursor está después que el start (y en el end, se supone):
          if (newPos <= this.cursorStart) {
            // CASO 3: Cuando el nuevo cursor está antes que el start: movemos el start y el end donde el start:
            return this.setSelectedPosition(newPos, this.cursorStart, newPos);
          } else {
            // CASO 4: Cuando el nuevo cursor está que el start: movemos el end solamente:
            return this.setSelectedPosition(this.cursorStart, newPos, newPos);
          }
        }
      },
      dragCursorToLineEnd() {
        this.$trace("dragCursorToLineEnd");
        // @TOSOLVE
        // @BYME:
        const { line, ch, pos } = this.getCursorPosition();
        const currentLineArray = this.textMatrix[line];
        const newPos = currentLineArray[this.textMatrix[line].length - 1].pos;
        if (pos >= this.cursorEnd) {
          // CASO 1: Cuando el viejo cursor está después o igual que el end:
          return this.setSelectedPosition(this.cursorStart, newPos, newPos);
        } else {
          // CASO 2: Cuando el viejo cursor está antes que el end (y en el start, se supone):
          if (newPos >= this.cursorEnd) {
            // CASO 3: Cuando el nuevo cursor está antes que el start: movemos el start y el end donde el start:
            return this.setSelectedPosition(this.cursorEnd, newPos, newPos);
          } else {
            // CASO 4: Cuando el nuevo cursor está que el start: movemos el end solamente:
            return this.setSelectedPosition(newPos, this.cursorEnd, newPos);
          }
        }
      },
      dragCursorToPageUp() {
        this.$trace("dragCursorToPageUp");
        // @TOSOLVE
      },
      dragCursorToPageDown() {
        this.$trace("dragCursorToPageDown");
        // @TOSOLVE
      },
      scrollPageUp() {
        this.$trace("scrollPageUp");
        // @TOSOLVE
      },
      scrollPageDown() {
        this.$trace("scrollPageDown");
        // @TOSOLVE
      },
      injectCharacter(newCh) {
        this.$trace("injectCharacter");
        const { pos } = this.getCursorPosition();
        const newPos = pos + 1;
        this.currentText = this.currentText.slice(0, pos) + newCh + this.currentText.slice(pos);
        this.synchronizeMatrixFromText();
        this.setSelectedPosition(newPos, newPos, newPos);
      },
      dropSelection() {
        this.$trace("dropSelection");
        const { line, ch, pos } = this.getCursorPosition();
        const posIni = this.cursorStart;
        const posEnd = this.cursorEnd;
        this.currentText = this.currentText.slice(0, posIni) + this.currentText.slice(posEnd);
        this.synchronizeMatrixFromText();
        this.setSelectedPosition(posIni, posIni, posIni);
      },
      deleteSelectionOrCharacter(isBackspace = false) {
        this.$trace("deleteSelectionOrCharacter");
        if (this.hasSelectedRange()) {
          this.dropSelection();
        } else {
          if (isBackspace) {
            const { pos } = this.getCursorPosition();
            const newPos = pos - 1;
            if(newPos < 0) {
              return;
            }
            this.currentText = this.currentText.slice(0, newPos) + this.currentText.slice(pos);
            this.synchronizeMatrixFromText();
            this.setSelectedPosition(newPos, newPos, newPos);
          } else {
            const { pos } = this.getCursorPosition();
            const newPos = pos;
            if(newPos >= this.currentText.length) {
              return;
            }
            this.currentText = this.currentText.slice(0, newPos) + this.currentText.slice(newPos + 1);
            this.synchronizeMatrixFromText();
            this.setSelectedPosition(newPos, newPos, newPos);
          }
        }
      }
    },
    watch: {

    },
    async mounted() {
      try {
        this.$trace("lsw-keyboard-1-text.mounted");
      } catch (error) {
        console.log(error);
      }
    }
  });
})();
// @code.end: LswKeyboard1Text API