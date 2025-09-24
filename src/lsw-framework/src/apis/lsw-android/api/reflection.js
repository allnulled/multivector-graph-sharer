sys.reflection = {};
sys.reflection.instantiate = function (className, paramTypes, args) {
  var Class = abg.getClass("java.lang.Class");
  var ReflectArray = abg.getClass("java.lang.reflect.Array");
  var clazz = abg.getClass(className);
  var typeClasses = java.lang.reflect.Array.newInstance(Class, paramTypes.length);
  for (var i = 0; i < paramTypes.length; i++) {
    typeClasses[i] = Class.forName(paramTypes[i]);
  }
  var ctor = clazz.getConstructor(typeClasses);
  return ctor.newInstance(args);
};

