(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswFilesystem'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswFilesystem'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  class LswFilesystem extends UFS_manager.idb_driver {

    async scan_directory(...args) {
      this.trace("scan_directory", [...args]);
      try {
        const filesAsMap = await this.read_directory(...args);
        return Object.keys(filesAsMap);
      } catch (error) {
        console.log(error);
        return {};
      }
    }

    async read_file_or_return(filepath, defaultValue = undefined) {
      this.trace("read_file_or_return", [filepath, contents]);
      try {
        return await this.read_file(filepath);
      } catch (error) {
        return defaultValue;
      }
    }

    async scan_directory_or_return(filepath, defaultValue = undefined) {
      this.trace("scan_directory_or_return", [filepath, contents]);
      try {
        return await this.scan_directory(filepath);
      } catch (error) {
        return defaultValue;
      }
    }

    async ensureFile(filepath, contents) {
      this.trace("ensureFile", [filepath, contents]);
      const pathParts = filepath.split("/").filter(file => file.trim() !== "");
      const directoryParts = [].concat(pathParts);
      const filename = directoryParts.pop();
      let currentPathPart = "";
      for (let index = 0; index < directoryParts.length; index++) {
        const pathPart = directoryParts[index];
        currentPathPart += "/" + pathPart;
        const existsSubpath = await this.exists(currentPathPart);
        if (!existsSubpath) {
          await this.make_directory(currentPathPart);
        }
      }
      const filepath2 = currentPathPart + "/" + filename;
      const existsFilepath2 = await this.exists(filepath2);
      if (!existsFilepath2) {
        await this.write_file(filepath2, contents);
      }
    }
    
    async ensureDirectory(filepath) {
      this.trace("ensureDirectory", [filepath]);
      const pathParts = filepath.split("/").filter(file => file.trim() !== "");
      const directoryParts = [].concat(pathParts);
      const filename = directoryParts.pop();
      let currentPathPart = "";
      for (let index = 0; index < directoryParts.length; index++) {
        const pathPart = directoryParts[index];
        currentPathPart += "/" + pathPart;
        const existsSubpath = await this.exists(currentPathPart);
        if (!existsSubpath) {
          await this.make_directory(currentPathPart);
        }
      }
      const filepath2 = currentPathPart + "/" + filename;
      const existsFilepath2 = await this.exists(filepath2);
      if (!existsFilepath2) {
        await this.make_directory(filepath2);
      }
    }

    async import_as_component(filepath, parameters = [], scope = this) {
      this.trace("import_as_component", [filepath]);
      let htmlContents = "", cssContents = "", jsContents = "";
      try {
        htmlContents = await this.read_file(filepath + ".html")
      } catch (error) {
        console.log(error);
        htmlContents = "";
      }
      try {
        cssContents = await this.read_file(filepath + ".css")
      } catch (error) {
        console.log(error);
        cssContents = "";
      }
      try {
        jsContents = await this.read_file(filepath + ".js")
      } catch (error) {
        console.log(error);
        jsContents = "";
      }
      jsContents = jsContents.replace(/\$template/g, JSON.stringify(htmlContents));
      Import_css: {
        let cssEl = document.querySelector(`[data-filepath='${filepath}']`);
        if(cssEl) {
          cssEl.remove();
        }
        const styleEl = document.createElement("style");
        styleEl.setAttribute("data-filepath", filepath);
        styleEl.textContent = cssContents;
        document.body.appendChild(styleEl);
      }
      Import_js: {
        const jsCallback = LswUtils.createAsyncFunction(jsContents);
        try {
          return await jsCallback.call(scope, ...parameters);
        } catch (error) {
          console.log("[!] Error importing js from component:");
          console.log(error);
          throw error;
        }
      }
    }

    async evaluateAsJavascriptFile(filepath, scope = undefined) {
      this.trace("evaluateAsJavascriptFile", [filepath]);
      const fileContents = await this.read_file(filepath);
      const AsyncFunction = (async function() {}).constructor;
      const asyncFunction = new AsyncFunction(fileContents);
      console.log("[*] Evaluating file as js:", asyncFunction.toString());
      const result = await asyncFunction.call(scope);
      return result;
    }

    evaluateAsJavascriptFileOrReturn(filepath, output = null, scope = undefined) {
      this.trace("evaluateAsJavascriptFileOrReturn", [filepath]);
      return this.evaluateAsJavascriptFile(filepath, scope).catch(error => {
        console.log("[!] Error evaluating file", error);
        return output;
      });
    }

    async evaluateAsRhinoFile(filepath, scope = undefined) {
      this.trace("evaluateAsRhinoFile", [filepath]);
      if(typeof cordova === "undefined") {
        throw new Error("Required cordova api on «LswFilesystem.evaluateAsRhinoFile»");
      }
      const fileContents = await this.read_file(filepath);
      await LswLazyLoads.loadBabel();
      const es6code = fileContents;
      const es5code = Babel.transform(es6code, {
        presets: []
      });
      const syncFunction = new Function(es5code);
      console.log("[*] Evaluating file as js (for Android/Rhino):", );
      const result = await syncFunction.call(scope);
      return result;
    }

    evaluateAsRhinoFileOrReturn(filepath, output = null, scope = undefined) {
      this.trace("evaluateAsRhinoFileOrReturn", [filepath]);
      return this.evaluateAsRhinoFile(filepath, scope).catch(error => {
        console.log("[!] Error evaluating file", error);
        return output;
      });
    }

    
    
    
    evaluateAsDotenvListFileOrReturn(filepath) {
      this.trace("evaluateAsDotenvListFileOrReturn", [filepath]);
      return this.evaluateAsDotenvListFile(filepath).catch(error => {
        console.log("[!] Error evaluating file (as .env list):", error);
        return output;
      });
    }

    async evaluateAsDotenvListFile(filepath) {
      this.trace("evaluateAsDotenvListFile", [filepath]);
      const fileContents = await this.read_file(filepath);
      return this.evaluateAsDotenvListText(fileContents);
    }

    evaluateAsDotenvListText(fileContents) {
      this.trace("evaluateAsDotenvListText", [fileContents]);
      const result = fileContents.split(/\n/).filter(line => line.trim() !== "").reduce((output, line) => {
        const cleanLine = line.trim();
        if(cleanLine !== "") {
          output.push(cleanLine);
        }
        return output;
      }, []);
      return result;
    }

    evaluateAsDotenvText(fileContents) {
      this.trace("evaluateAsDotenvText", [fileContents]);
      const result = fileContents.split(/\n/).filter(line => line.trim() !== "").reduce((output, line) => {
        const [ id, value = "" ] = line.split(/\=/);
        output[id.trim()] = (value || "").trim();
        return output;
      }, {});
      return result;
    }

    async evaluateAsDotenvFile(filepath) {
      this.trace("evaluateAsDotenvFile", [filepath]);
      const fileContents = await this.read_file(filepath);
      return this.evaluateAsDotenvText(fileContents);
    }

    evaluateAsDotenvFileOrReturn(filepath, output = {}) {
      this.trace("evaluateAsDotenvFileOrReturn", [filepath]);
      return this.evaluateAsDotenvFile(filepath).catch(error => {
        console.log("[!] Error evaluating file (as .env):", error);
        return output;
      });
    }

    async evaluateAsTripiFile(filepath) {
      this.trace("evaluateAsTripiFile", [filepath]);
      const fileContents = await this.read_file(filepath);
      const result = LswTreeParser.parse(fileContents);
      return result;
    }

    async evaluateAsTripiFileOrReturn(filepath, output = {}) {
      this.trace("evaluateAsTripiFileOrReturn", [filepath]);
      try {
        const fileContents = await this.read_file(filepath);
        const result = LswTreeParser.parse(fileContents);
        return result;
      } catch (error) {
        console.log("[!] Error evaluating file (as .tri):", error);
        return output;
      }
    }

    async evaluateAsWeekFile() {
      this.trace("evaluateAsWeekFile", [filepath]);
      const fileContents = await this.read_file(filepath);
      return WeekLang.parse(fileContents);
    }

    async evaluateAsWeekFileOrReturn(filepath, output = {}) {
      this.trace("evaluateAsWeekFileOrReturn", [filepath]);
      try {
        const fileContents = await this.read_file(filepath);
        const result = WeekLang.parse(fileContents);
        return result;
      } catch (error) {
        console.log("[!] Error evaluating file (as .week):", error);
        return output;
      }
    }

  }

  return LswFilesystem;

});