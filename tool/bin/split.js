// Generated by Haxe 3.3.0
if (process.version < "v4.0.0") console.warn("Module " + (typeof(module) == "undefined" ? "" : module.filename) + " requires node.js version 4.0.0 or higher");
(function () { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var Bundler = function(parser,sourceMap) {
	this.bundles = [];
	this.parser = parser;
	this.sourceMap = sourceMap;
};
Bundler.__name__ = true;
Bundler.prototype = {
	generate: function(src,output) {
		console.log("Emit " + output);
		var buffer = this.emitBundle(src,this.main,this.mainExports,true);
		this.writeMap(output,buffer);
		this.write(output,buffer.src);
		var _g = 0;
		var _g1 = this.bundles;
		while(_g < _g1.length) {
			var bundle = _g1[_g];
			++_g;
			var bundleOutput = js_node_Path.join(js_node_Path.dirname(output),bundle.name + ".js");
			console.log("Emit " + bundleOutput);
			buffer = this.emitBundle(src,bundle,[bundle.name],false);
			this.writeMap(bundleOutput,buffer);
			this.write(bundleOutput,buffer.src);
		}
	}
	,writeMap: function(output,buffer) {
		if(buffer.map == null) {
			return;
		}
		this.write("" + output + ".map",this.sourceMap.emitFile(output,buffer.map));
		buffer.src += "\n" + "//# sourceMappingURL=" + js_node_Path.basename(output) + ".map";
	}
	,write: function(output,buffer) {
		if(buffer == null) {
			return;
		}
		if(this.hasChanged(output,buffer)) {
			js_node_Fs.writeFileSync(output,buffer);
		}
	}
	,hasChanged: function(output,buffer) {
		if(!js_node_Fs.existsSync(output)) {
			return true;
		}
		return js_node_Fs.readFileSync(output).toString() != buffer;
	}
	,emitBundle: function(src,bundle,exports,isMain) {
		var buffer = "";
		var body = this.parser.rootBody.slice();
		var head = body.shift();
		var run = isMain?body.pop():null;
		var inc = bundle.nodes;
		var mapNodes = [];
		var mapOffset = 0;
		buffer = "" + this.verifyExport(HxOverrides.substr(src,0,head.end + 1));
		buffer += "var require = (function(r){ return function require(m) { return r[m]; } })($hx_exports.__registry__);\n";
		mapOffset = 1;
		buffer += "var $s = $hx_exports.__shared__ = $hx_exports.__shared__ || {};\n";
		mapOffset = 2;
		if(bundle.shared.length > 0) {
			var _g = 0;
			var _g1 = bundle.shared;
			while(_g < _g1.length) {
				var node = _g1[_g];
				++_g;
				buffer += "var " + node + " = $" + "s." + node + "; ";
			}
			buffer += "\n";
			mapOffset = 3;
		}
		var _g2 = 0;
		while(_g2 < body.length) {
			var node1 = body[_g2];
			++_g2;
			if(node1.__tag__ != null && inc.indexOf(node1.__tag__) < 0) {
				continue;
			}
			mapNodes.push(node1);
			buffer += HxOverrides.substr(src,node1.start,node1.end - node1.start);
			buffer += "\n";
		}
		if(exports.length > 0) {
			var _g3 = 0;
			while(_g3 < exports.length) {
				var node2 = exports[_g3];
				++_g3;
				buffer += "$" + "s." + node2 + " = " + node2 + "; ";
			}
			buffer += "\n";
		}
		if(run != null) {
			buffer += HxOverrides.substr(src,run.start,run.end - run.start);
			buffer += "\n";
		}
		buffer += "})(typeof $hx_scope != \"undefined\" ? $hx_scope : $hx_scope = {});\n";
		return { src : buffer, map : this.sourceMap.emitMappings(mapNodes,mapOffset)};
	}
	,verifyExport: function(s) {
		return s.replace(new RegExp("function \\([^)]*\\)","".split("u").join("")),"function ($" + "hx_exports)");
	}
	,process: function(modules) {
		console.log("Bundling...");
		var g = this.parser.graph;
		var _g = 0;
		while(_g < modules.length) {
			var $module = modules[_g];
			++_g;
			this.unlink(g,$module);
		}
		var mainNodes = graphlib_Alg.preorder(g,"Main");
		var exports = [];
		var _g1 = 0;
		while(_g1 < modules.length) {
			var module1 = modules[_g1];
			++_g1;
			var nodes = graphlib_Alg.preorder(g,module1);
			var shared = [nodes.filter((function() {
				return function(v) {
					return mainNodes.indexOf(v) >= 0;
				};
			})())];
			nodes = nodes.filter((function(shared1) {
				return function(v1) {
					return shared1[0].indexOf(v1) < 0;
				};
			})(shared));
			exports = this.addOnce(shared[0],exports);
			this.bundles.push({ name : module1, nodes : nodes, shared : shared[0]});
		}
		this.main = { name : "Main", nodes : mainNodes, shared : modules};
		this.mainExports = exports;
	}
	,addOnce: function(source,target) {
		var temp = target.slice();
		var _g = 0;
		while(_g < source.length) {
			var node = source[_g];
			++_g;
			if(target.indexOf(node) < 0) {
				temp.push(node);
			}
		}
		return temp;
	}
	,unlink: function(g,name) {
		var pred = g.predecessors(name);
		var _g = 0;
		while(_g < pred.length) {
			var p = pred[_g];
			++_g;
			g.removeEdge(p,name);
		}
	}
};
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.strDate = function(s) {
	var _g = s.length;
	switch(_g) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k1 = s.split("-");
		return new Date(k1[0],k1[1] - 1,k1[2],0,0,0);
	case 19:
		var k2 = s.split(" ");
		var y = k2[0].split("-");
		var t = k2[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw new js__$Boot_HaxeError("Invalid date format : " + s);
	}
};
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) {
		return undefined;
	}
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(len == null) {
		len = s.length;
	} else if(len < 0) {
		if(pos == 0) {
			len = s.length + len;
		} else {
			return "";
		}
	}
	return s.substr(pos,len);
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Main = function() { };
Main.__name__ = true;
Main.main = function() {
	var args = process.argv;
	if(args.length < 3) {
		process.stdout.write("Haxe-JS code splitting, usage:");
		process.stdout.write("\n");
		process.stdout.write("");
		process.stdout.write("\n");
		process.stdout.write("  haxe-split <path to input.js> <path to main output.js> [<module name 1> <module name 2> ...]");
		process.stdout.write("\n");
		process.stdout.write("");
		process.stdout.write("\n");
		return;
	}
	var t0 = new Date().getTime();
	var input = args[2];
	var output = args[3];
	var modules = args.slice(4);
	var src = js_node_Fs.readFileSync(input).toString();
	var parser = new Parser(src);
	var sourceMap = new SourceMap(input,src);
	var t1 = new Date().getTime();
	var bundler = new Bundler(parser,sourceMap);
	bundler.process(modules);
	bundler.generate(src,output);
	var t2 = new Date().getTime();
	console.log("Generated in " + (t2 - t1) + "ms");
	console.log("Total process in " + (t2 - t0) + "ms");
};
Math.__name__ = true;
var ParseStep = { __ename__ : true, __constructs__ : ["Start","Definitions","Utils","StaticInit"] };
ParseStep.Start = ["Start",0];
ParseStep.Start.__enum__ = ParseStep;
ParseStep.Definitions = ["Definitions",1];
ParseStep.Definitions.__enum__ = ParseStep;
ParseStep.Utils = ["Utils",2];
ParseStep.Utils.__enum__ = ParseStep;
ParseStep.StaticInit = ["StaticInit",3];
ParseStep.StaticInit.__enum__ = ParseStep;
var Parser = function(src) {
	var t0 = new Date().getTime();
	this.processInput(src);
	var t1 = new Date().getTime();
	console.log("Parsed in " + (t1 - t0) + "ms");
	this.buildGraph();
	console.log("Graph processed in " + (new Date().getTime() - t1) + "ms");
};
Parser.__name__ = true;
Parser.prototype = {
	processInput: function(src) {
		this.walkProgram(acorn_Acorn.parse(src,{ ecmaVersion : 5, locations : true, ranges : true}));
	}
	,buildGraph: function() {
		var g = new graphlib_Graph({ directed : true, compound : true});
		var cpt = 0;
		var refs = 0;
		var tmp = this.types.keys();
		while(tmp.hasNext()) {
			var t = tmp.next();
			++cpt;
			g.setNode(t,t);
		}
		var tmp1 = this.types.keys();
		while(tmp1.hasNext()) {
			var t1 = tmp1.next();
			var _this = this.types;
			refs += this.walk(g,t1,__map_reserved[t1] != null?_this.getReserved(t1):_this.h[t1]);
		}
		var tmp2 = this.init.keys();
		while(tmp2.hasNext()) {
			var t2 = tmp2.next();
			var _this1 = this.init;
			refs += this.walk(g,t2,__map_reserved[t2] != null?_this1.getReserved(t2):_this1.h[t2]);
		}
		console.log("Stats: " + cpt + " types, " + refs + " references");
		this.graph = g;
	}
	,walk: function(g,id,nodes) {
		var _gthis = this;
		var refs = 0;
		var visitors = { Identifier : function(node) {
			var name = node.name;
			var tmp;
			if(name != id) {
				var _this = _gthis.types;
				if(__map_reserved[name] != null) {
					tmp = _this.existsReserved(name);
				} else {
					tmp = _this.h.hasOwnProperty(name);
				}
			} else {
				tmp = false;
			}
			if(tmp) {
				g.setEdge(id,name);
				++refs;
			}
		}};
		var _g = 0;
		while(_g < nodes.length) {
			var decl = nodes[_g];
			++_g;
			acorn_Walk.simple(decl,visitors);
		}
		return refs;
	}
	,walkProgram: function(program) {
		this.candidates = new haxe_ds_StringMap();
		this.types = new haxe_ds_StringMap();
		this.init = new haxe_ds_StringMap();
		this.requires = new haxe_ds_StringMap();
		this.step = ParseStep.Start;
		var body = this.getBodyNodes(program);
		var _g = 0;
		while(_g < body.length) {
			var node = body[_g];
			++_g;
			if(node.type == "ExpressionStatement") {
				this.walkRootExpression(node.expression);
			} else {
				throw new js__$Boot_HaxeError("Expecting single root statement in program");
			}
		}
	}
	,walkRootExpression: function(expr) {
		if(expr.type == "CallExpression") {
			this.walkRootFunction(expr.callee);
		} else {
			throw new js__$Boot_HaxeError("Expecting root statement to be a function call");
		}
	}
	,walkRootFunction: function(callee) {
		var block = this.getBodyNodes(callee)[0];
		if(block.type == "BlockStatement") {
			this.walkDeclarations(this.getBodyNodes(block));
		} else {
			throw new js__$Boot_HaxeError("Expecting block of statements inside root function");
		}
	}
	,walkDeclarations: function(body) {
		this.rootBody = body;
		var _g = 0;
		while(_g < body.length) {
			var node = body[_g];
			++_g;
			switch(node.type) {
			case "ExpressionStatement":
				this.inspectExpression(node.expression,node);
				break;
			case "FunctionDeclaration":
				if(this.inspectFunction(node.id,node)) {
					continue;
				}
				break;
			case "IfStatement":
				if(node.consequent.type == "ExpressionStatement") {
					this.inspectExpression(node.consequent.expression,node);
				}
				break;
			case "VariableDeclaration":
				this.inspectDeclarations(node.declarations,node);
				break;
			default:
			}
		}
	}
	,inspectFunction: function(id,def) {
		var path = this.getIdentifier(id);
		if(path.length > 0) {
			switch(path[0]) {
			case "$bind":
				this.step = ParseStep.StaticInit;
				return true;
			case "$extend":
				this.step = ParseStep.Definitions;
				return true;
			}
		}
		return false;
	}
	,inspectExpression: function(expression,def) {
		switch(expression.type) {
		case "AssignmentExpression":
			var path = this.getIdentifier(expression.left);
			if(path.length > 0) {
				var name = path[0];
				switch(name) {
				case "$hxClasses":
					var moduleName = this.getIdentifier(expression.right);
					if(moduleName.length == 1) {
						this.promote(moduleName[0],def);
					}
					break;
				case "$hx_exports":
					break;
				default:
					var _this = this.types;
					if(__map_reserved[name] != null?_this.existsReserved(name):_this.h.hasOwnProperty(name)) {
						this.append(name,def);
					} else if(path[1] == "__name__") {
						this.promote(name,def);
					}
				}
			}
			break;
		case "CallExpression":
			var name1 = this.getIdentifier(expression.callee.object);
			var prop = this.getIdentifier(expression.callee.property);
			var tmp;
			if(prop.length > 0 && name1.length > 0) {
				var _this1 = this.types;
				var key = name1[0];
				if(__map_reserved[key] != null) {
					tmp = _this1.existsReserved(key);
				} else {
					tmp = _this1.h.hasOwnProperty(key);
				}
			} else {
				tmp = false;
			}
			if(tmp) {
				this.append(name1[0],def);
			}
			break;
		default:
		}
	}
	,inspectDeclarations: function(declarations,def) {
		if(this.step == ParseStep.StaticInit) {
			return;
		}
		var _g = 0;
		while(_g < declarations.length) {
			var decl = declarations[_g];
			++_g;
			if(decl.id != null) {
				var name = decl.id.name;
				if(decl.init != null) {
					var init = decl.init;
					switch(init.type) {
					case "AssignmentExpression":
						if(init.right.type == "FunctionExpression") {
							var _this = this.candidates;
							if(__map_reserved[name] != null) {
								_this.setReserved(name,def);
							} else {
								_this.h[name] = def;
							}
						}
						break;
					case "CallExpression":
						if(this.isRequire(init.callee)) {
							this.required(name,def);
						}
						break;
					case "FunctionExpression":
						var _this1 = this.candidates;
						if(__map_reserved[name] != null) {
							_this1.setReserved(name,def);
						} else {
							_this1.h[name] = def;
						}
						break;
					case "MemberExpression":
						if(init.object.type == "CallExpression" && this.isRequire(init.object.callee)) {
							this.required(name,def);
						}
						break;
					case "ObjectExpression":
						if(this.isEnum(init)) {
							this.register(name,def);
						} else {
							var _this2 = this.candidates;
							if(__map_reserved[name] != null) {
								_this2.setReserved(name,def);
							} else {
								_this2.h[name] = def;
							}
						}
						break;
					default:
					}
				}
			}
		}
	}
	,required: function(name,def) {
		var _this = this.requires;
		if(__map_reserved[name] != null) {
			_this.setReserved(name,def);
		} else {
			_this.h[name] = def;
		}
	}
	,register: function(name,def) {
		def.__tag__ = name;
		var _this = this.types;
		var value = [def];
		if(__map_reserved[name] != null) {
			_this.setReserved(name,value);
		} else {
			_this.h[name] = value;
		}
		var _this1 = this.init;
		var value1 = [];
		if(__map_reserved[name] != null) {
			_this1.setReserved(name,value1);
		} else {
			_this1.h[name] = value1;
		}
	}
	,promote: function(name,def) {
		var _this = this.candidates;
		if(__map_reserved[name] != null?_this.existsReserved(name):_this.h.hasOwnProperty(name)) {
			var _this1 = this.candidates;
			var cDef = __map_reserved[name] != null?_this1.getReserved(name):_this1.h[name];
			this.candidates.remove(name);
			cDef.__tag__ = name;
			def.__tag__ = name;
			var _this2 = this.types;
			var value = [cDef,def];
			if(__map_reserved[name] != null) {
				_this2.setReserved(name,value);
			} else {
				_this2.h[name] = value;
			}
			var _this3 = this.init;
			var value1 = [];
			if(__map_reserved[name] != null) {
				_this3.setReserved(name,value1);
			} else {
				_this3.h[name] = value1;
			}
		} else {
			var _this4 = this.types;
			if(__map_reserved[name] != null?_this4.existsReserved(name):_this4.h.hasOwnProperty(name)) {
				this.append(name,def);
			}
		}
	}
	,append: function(name,def) {
		def.__tag__ = name;
		var defs;
		if(this.step == ParseStep.Definitions) {
			var _this = this.types;
			defs = __map_reserved[name] != null?_this.getReserved(name):_this.h[name];
		} else {
			var _this1 = this.init;
			defs = __map_reserved[name] != null?_this1.getReserved(name):_this1.h[name];
		}
		defs.push(def);
	}
	,isEnum: function(node) {
		var props = node.properties;
		if(node.type == "ObjectExpression" && props != null && props.length > 0) {
			return this.getIdentifier(props[0].key)[0] == "__ename__";
		} else {
			return false;
		}
	}
	,isRequire: function(node) {
		if(node != null && node.type == "Identifier") {
			return node.name == "require";
		} else {
			return false;
		}
	}
	,getBodyNodes: function(node) {
		if((node.body instanceof Array) && node.body.__enum__ == null) {
			return node.body;
		} else {
			return [node.body];
		}
	}
	,getIdentifier: function(left) {
		switch(left.type) {
		case "Identifier":
			return [left.name];
		case "Literal":
			return [left.raw];
		case "MemberExpression":
			return this.getIdentifier(left.object).concat(this.getIdentifier(left.property));
		default:
			return [];
		}
	}
};
var SourceMap = function(input,src) {
	var p = src.lastIndexOf("//# sourceMappingURL=");
	if(p < 0) {
		return;
	}
	this.fileName = StringTools.trim(HxOverrides.substr(src,p + "//# sourceMappingURL=".length,null));
	this.fileName = js_node_Path.join(js_node_Path.dirname(input),this.fileName);
	var raw = JSON.parse(js_node_Fs.readFileSync(this.fileName).toString());
	this.source = new sourcemap_SourceMapConsumer(raw);
};
SourceMap.__name__ = true;
SourceMap.prototype = {
	emitMappings: function(nodes,offset) {
		if(nodes.length == 0 || this.source == null) {
			return null;
		}
		var inc = [];
		var line = 3 + offset;
		var _g = 0;
		while(_g < nodes.length) {
			var node = nodes[_g];
			++_g;
			var _g2 = node.loc.start.line;
			var _g1 = node.loc.end.line + 1;
			while(_g2 < _g1) inc[_g2++] = line++;
		}
		var output = new sourcemap_SourceMapGenerator();
		try {
			this.source.eachMapping(function(mapping) {
				if(!isNaN(inc[mapping.generatedLine])) {
					output.addMapping({ source : mapping.source, original : { line : mapping.originalLine, column : mapping.originalColumn >= 0?mapping.originalColumn:0}, generated : { line : inc[mapping.generatedLine], column : mapping.generatedColumn}});
				}
			});
			return output;
		} catch( err ) {
			console.log("Invalid source-map");
		}
		return output;
	}
	,emitFile: function(output,map) {
		if(map == null) {
			return null;
		}
		map.file = js_node_Path.basename(output);
		return map.toString();
	}
};
var StringTools = function() { };
StringTools.__name__ = true;
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	if(!(c > 8 && c < 14)) {
		return c == 32;
	} else {
		return true;
	}
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) ++r;
	if(r > 0) {
		return HxOverrides.substr(s,r,l - r);
	} else {
		return s;
	}
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) ++r;
	if(r > 0) {
		return HxOverrides.substr(s,0,l - r);
	} else {
		return s;
	}
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
var acorn_Acorn = require("acorn");
var acorn_Walk = require("acorn/dist/walk");
var graphlib_Graph = require("graphlib").Graph;
var graphlib_Alg = require("graphlib/lib/alg");
var haxe_IMap = function() { };
haxe_IMap.__name__ = true;
var haxe_ds_StringMap = function() {
	this.h = { };
};
haxe_ds_StringMap.__name__ = true;
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	setReserved: function(key,value) {
		if(this.rh == null) {
			this.rh = { };
		}
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) {
			return null;
		} else {
			return this.rh["$" + key];
		}
	}
	,existsReserved: function(key) {
		if(this.rh == null) {
			return false;
		}
		return this.rh.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		if(__map_reserved[key] != null) {
			key = "$" + key;
			if(this.rh == null || !this.rh.hasOwnProperty(key)) {
				return false;
			}
			delete(this.rh[key]);
			return true;
		} else {
			if(!this.h.hasOwnProperty(key)) {
				return false;
			}
			delete(this.h[key]);
			return true;
		}
	}
	,keys: function() {
		return HxOverrides.iter(this.arrayKeys());
	}
	,arrayKeys: function() {
		var out = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) {
			out.push(key);
		}
		}
		if(this.rh != null) {
			for( var key in this.rh ) {
			if(key.charCodeAt(0) == 36) {
				out.push(key.substr(1));
			}
			}
		}
		return out;
	}
};
var haxe_io_Bytes = function() { };
haxe_io_Bytes.__name__ = true;
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) {
		Error.captureStackTrace(this,js__$Boot_HaxeError);
	}
};
js__$Boot_HaxeError.__name__ = true;
js__$Boot_HaxeError.wrap = function(val) {
	if((val instanceof Error)) {
		return val;
	} else {
		return new js__$Boot_HaxeError(val);
	}
};
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
});
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.__string_rec = function(o,s) {
	if(o == null) {
		return "null";
	}
	if(s.length >= 5) {
		return "<...>";
	}
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) {
		t = "object";
	}
	switch(t) {
	case "function":
		return "<function>";
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) {
					return o[0];
				}
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) {
						str += "," + js_Boot.__string_rec(o[i],s);
					} else {
						str += js_Boot.__string_rec(o[i],s);
					}
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g11 = 0;
			var _g2 = l;
			while(_g11 < _g2) {
				var i2 = _g11++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") {
				return s2;
			}
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) {
			str2 += ", \n";
		}
		str2 += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "string":
		return o;
	default:
		return String(o);
	}
};
var js_node_Fs = require("fs");
var js_node_Path = require("path");
var js_node_buffer_Buffer = require("buffer").Buffer;
var sourcemap_SourceMapConsumer = require("source-map").SourceMapConsumer;
var sourcemap_SourceMapGenerator = require("source-map").SourceMapGenerator;
String.__name__ = true;
Array.__name__ = true;
Date.__name__ = ["Date"];
var __map_reserved = {}
Bundler.REQUIRE = "var require = (function(r){ return function require(m) { return r[m]; } })($hx_exports.__registry__);\n";
Bundler.SHARED = "var $s = $hx_exports.__shared__ = $hx_exports.__shared__ || {};\n";
Bundler.SCOPE = "})(typeof $hx_scope != \"undefined\" ? $hx_scope : $hx_scope = {});\n";
SourceMap.SRC_REF = "//# sourceMappingURL=";
Main.main();
})();
