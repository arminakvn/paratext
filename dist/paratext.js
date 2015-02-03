(function(root, undefined) {

  "use strict";



/* paratext main */

(function() {
  var addChainedAttributeAccessor, paratext,
    __slice = [].slice;

  paratext = L.ParaText = L.Class.extend({
    includes: L.Mixin.Events,
    options: {
      field_category: ''
    },
    initialize: function(text, options) {
      var _this;
      this.text = text;
      this.properties = {
        id: 0,
        members: [],
        _margin: {
          t: 20,
          l: 30,
          b: 30,
          r: 30
        },
        relations: [],
        edges: [],
        lat: 0,
        long: 0
      };
      _this = this;
      L.setOptions(_this, options);
    },
    addTo: function(map) {
      map.addLayer(this);
      return this;
    },
    field_category: function(newFieldCategory) {
      this.options.field_category = newFieldCategory;
      return this;
    },
    makeRelations: function() {
      var key, value, _ref, _results;
      if (this.options.field_category !== '') {
        _ref = this.text;
        _results = [];
        for (key in _ref) {
          value = _ref[key];
          _results.push(this.properties.edges.push({
            nodes: [key],
            rel_type: 'internal',
            rel_param: value[this.options.field_category]
          }));
        }
        return _results;
      }
    },
    find_relations: function(d) {},
    show_contexts: function(d, e) {
      var featureData, onMapPosition, _d3obj, _domEl;
      featureData = [];
      featureData.push(d[this.options.field_category]);
      onMapPosition = this._m.containerPointToLayerPoint([L.DomEvent.getMousePosition(e).x + $(this._m.getContainer())[0].clientWidth / 6, $(this._m.getContainer())[0].clientHeight / 4]);
      _domEl = this.makeDiv('context', onMapPosition);
      if (this._d3obj) {
        _d3obj = this._d3obj;
        d3.selectAll(document.getElementsByClassName("context span")).data([]).remove();
      } else {
        d3.selectAll(document.getElementsByClassName("context span")).data([]).remove();
      }
      _d3obj = d3.select(_domEl).selectAll("span").data([]).remove();
      _d3obj = d3.select(_domEl).selectAll("span").data([d.description]).enter();
      console.log("_d3obj", _d3obj);
      return _d3obj.append("span").text("").attr("class", "context span").text((function(_this) {
        return function(d, i) {
          return d;
        };
      })(this));
    },
    hide_context: function() {
      var _domEl;
      if (this._domEl) {
        _domEl = this._domEl;
      }
      if (L.DomUtil.getStyle(_domEl, 'opacity') < 0.5) {
        return L.DomUtil.setOpacity(_domEl, 0);
      }
    },
    makeDiv2: function(name) {
      var divControl;
      divControl = L.Control.extend({
        initialize: (function(_this) {
          return function() {
            var disable3D, fx, position, _domEl, _domObj;
            position = "topleft";
            _domEl = L.DomUtil.create('div', "container " + name + "-info");
            L.DomUtil.enableTextSelection(_domEl);
            _this._m.getContainer().getElementsByClassName("leaflet-control-container")[0].appendChild(_domEl);
            _domObj = $(L.DomUtil.get(_domEl));
            _domObj.css('width', $(_this._m.getContainer())[0].clientWidth / 3);
            _domObj.css('height', $(_this._m.getContainer())[0].clientHeight / 3);
            _domObj.css('background-color', 'white');
            L.DomUtil.setOpacity(L.DomUtil.get(_domEl), 0.75);
            L.DomUtil.setPosition(L.DomUtil.get(_domEl), L.point($(_this._m.getContainer())[0].clientWidth / 1.6, $(_this._m.getContainer())[0].clientHeight / 4), disable3D = 0);
            fx = new L.PosAnimation();
            fx.run(L.DomUtil.get(_domEl), position, 0.9);
            return _domEl = _domEl;
          };
        })(this)
      });
      new divControl();
    },
    makeDiv: function(name, position) {
      var divControl;
      divControl = L.Control.extend({
        initialize: (function(_this) {
          return function() {
            var disable3D, fx, _domEl, _domObj;
            if (_this._domEl) {
              _domEl = _this._domEl;
              if (L.DomUtil.getStyle(_domEl, 'opacity') < 0.5) {
                L.DomUtil.setOpacity(_domEl, 0);
              }
            } else {
              _domEl = L.DomUtil.create('div', "container " + name + "-info");
              L.DomUtil.enableTextSelection(_domEl);
              _this._m.getContainer().getElementsByClassName("leaflet-control-container")[0].appendChild(_domEl);
            }
            _domObj = $(L.DomUtil.get(_domEl));
            _domObj.css('width', $(_this._m.getContainer())[0].clientWidth / 6);
            _domObj.css('height', $(_this._m.getContainer())[0].clientHeight / 6);
            _domObj.css('background-color', 'white');
            L.DomUtil.setOpacity(L.DomUtil.get(_domEl), 0.7);
            L.DomUtil.setPosition(L.DomUtil.get(_domEl), L.point($(_this._m.getContainer())[0].clientWidth / 2, $(_this._m.getContainer())[0].clientHeight / 2 + $(_this._m.getContainer())[0].clientHeight / 4), disable3D = 0);
            fx = new L.PosAnimation();
            fx.run(L.DomUtil.get(_domEl), position, 0.9);
            return _this._domEl = _domEl;
          };
        })(this)
      });
      new divControl();
      return this._domEl;
    },
    listStacker: function() {
      var each, _d3_obj, _i, _j, _len, _len1, _ref, _ref1, _results;
      _d3_obj = d3.selectAll(this._d3li);
      _ref = _d3_obj[0];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        each = _ref[_i];
        console.log("each", each);
      }
      _ref1 = _d3_obj[0][0];
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        each = _ref1[_j];
        _results.push(console.log(each.__data__));
      }
      return _results;
    },
    clearMap: function() {
      var e, i;
      for (i in this._m._layers) {
        if (this._m._layers[i]._path != null) {
          try {
            this._m.removeLayer(this._m._layers[i]);
          } catch (_error) {
            e = _error;
            this._m.removeLayer(this._m._layers[i]._path);
            continue;
          }
        }
      }
    },
    vizAllLocations: function() {
      return this._m.on("load moveend viewreset zoomend", (function(_this) {
        return function() {
          var each, _d3_obj, _i, _len, _ref, _results;
          if (_this._polyline) {
            _this.clearMap();
          }
          _d3_obj = d3.selectAll(_this._d3li);
          _ref = _d3_obj[0][0];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            each = _ref[_i];
            _results.push(_this.vizLocation(each.__data__, d3.select(each).property('id').replace('line-', '')));
          }
          return _results;
        };
      })(this));
    },
    vizLocation: function(d, i) {
      this._m.on("moveend viewreset zoomend", (function(_this) {
        return function() {
          var points, _polyline;
          if (_this._polyline) {
            _polyline = _this._polyline;
          }
          points = [];
          if (_this._m.getBounds().contains(_this._m.layerPointToLatLng(_this._m.latLngToLayerPoint(L.latLng(d.lat, d.long)))) && (_this._m.getBounds().contains(_this._m.layerPointToLatLng(_this._m.containerPointToLayerPoint([L.DomUtil.getViewportOffset(document.getElementById("line-" + i)).x + 20 + $(_this._m.getContainer())[0].clientWidth / 3, L.DomUtil.getViewportOffset(document.getElementById("line-" + i)).y]))))) {
            points.push(_this._m.layerPointToLatLng(_this._m.latLngToLayerPoint(L.latLng(d.lat, d.long))));
            points.push(_this._m.layerPointToLatLng(_this._m.containerPointToLayerPoint([L.DomUtil.getViewportOffset(document.getElementById("line-" + i)).x + 30 + $(_this._m.getContainer())[0].clientWidth / 3, L.DomUtil.getViewportOffset(document.getElementById("line-" + i)).y])));
          } else {
            points = [];
          }
          _polyline = L.polyline(points, {
            color: 'blue',
            opacity: 0.8,
            weight: 0.9
          });
          _polyline.on('add', function() {
            var timeout;
            _polyline.bringToFront();
            timeout = 0;
            return setTimeout((function() {
              $(L.DomUtil.get(_this._polyline._container)).animate({
                opacity: 0
              }, 4000, function() {});
            }));
          });
          _this._polyline = _polyline;
          return _polyline.addTo(_this._m);
        };
      })(this));
      return this._m;
    },
    getD3: function() {
      this._count = 0;
      this._canvas = $(".canvas");
      this._width = this._canvas.width() - this.properties._margin.l - this.properties._margin.r;
      this._height = this._canvas.height() - this.properties._margin.t - this.properties._margin.b;
      this._svg = d3.select(".").append("svg").attr("width", this._width + this.properties._margin.l + this.properties._margin.r).attr("height", this._height + this.properties._margin.t + this.properties._margin.b).append("g").attr("transform", "translate(" + this.properties._margin.l + "," + this.properties._margin.t + ")");
      this._svg.selectAll("text").data(this.properties.text).enter().append("text").attr("width", 2400).attr("height", 200).style("font-family", "Impact").attr("fill", "black").text(function(d) {
        return d.description;
      }).on("mouseover", function() {
        d3.select(this).transition().duration(300).style("fill", "gray");
      }).on("mouseout", function() {
        d3.select(this).transition().duration(300).style("fill", "black");
      }).transition().delay(0).duration(1).each("start", function() {
        d3.select(this).transition().duration(1).attr("y", (this._count + 1) * 30);
        this._count = this._count + 1;
      }).transition().duration(11).delay(1).style("opacity", 1);
      this._count = this._count + 1;
      return this._svg;
    },
    removeAnyLocation: function() {
      return d3.select(this._m.getPanes().overlayPane).select(".leaflet-zoom-animated").selectAll("g").data([]).exit().remove();
    },
    setViewByLocation: function(d) {
      return this._m.setView(new L.LatLng(d.lat, d.long), 19, {
        animation: true,
        duration: 50
      });
    },
    showLocation: function(d) {
      var featureData;
      featureData = [];
      featureData.push(new L.LatLng(d.lat, d.long));
      this._g = d3.select(this._m.getPanes().overlayPane).select(".leaflet-zoom-animated").selectAll("g");
      return this._g.data(featureData).enter().append("g").append("circle").attr("r", 0).attr("stroke", "white").attr("fill", "none").attr("stroke-width", "10").attr("cx", (function(_this) {
        return function(d) {
          return _this._m.latLngToLayerPoint(d).x;
        };
      })(this)).attr("cy", (function(_this) {
        return function(d) {
          return _this._m.latLngToLayerPoint(d).y;
        };
      })(this)).transition().delay(120).duration(1000).attr("r", 80).attr("stroke", "gray").attr("stroke-width", "1").attr("fill", "none").transition().delay(120).duration(1000).attr("r", 40).attr("stroke", "gray").attr("stroke-width", "2").attr("fill", "none");
    },
    makeMap: function() {
      var map, textControl;
      map = $("body").append("<div id='map'></div>");
      L.mapbox.accessToken = "pk.eyJ1IjoiYXJtaW5hdm4iLCJhIjoiSTFteE9EOCJ9.iDzgmNaITa0-q-H_jw1lJw";
      this._m = L.mapbox.map("map", "arminavn.ib1f592g", {
        zoomAnimation: true,
        zoomAnimationThreshold: 4,
        inertiaDeceleration: 4000,
        animate: true,
        duration: 1.75,
        easeLinearity: 0.1
      });
      this._m.setView([42.34, -71.12], 13);
      this._m.boxZoom.enable();
      this._m.scrollWheelZoom.disable();
      textControl = L.Control.extend({
        options: {
          position: "topleft"
        },
        onAdd: (function(_this) {
          return function(map) {
            var disable3D;
            _this._m = map;
            _this._textDomEl = L.DomUtil.create('div', 'container paratext-info');
            _this._el = L.DomUtil.create('svg', 'svg');
            _this._m.getPanes().overlayPane.appendChild(_this._el);
            L.DomUtil.enableTextSelection(_this._textDomEl);
            _this._m.getPanes().overlayPane.appendChild(_this._textDomEl);
            _this._textDomObj = $(L.DomUtil.get(_this._textDomEl));
            _this._textDomObj.css('width', $(_this._m.getContainer())[0].clientWidth / 3);
            _this._textDomObj.css('height', $(_this._m.getContainer())[0].clientHeight);
            _this._textDomObj.css('background-color', 'white');
            _this._textDomObj.css('overflow', 'scroll');
            L.DomUtil.setOpacity(L.DomUtil.get(_this._textDomEl), .8);
            if (_this._viewSet === void 0) {
              _this._viewSet = _this._m.getCenter();
            }
            L.DomUtil.setPosition(L.DomUtil.get(_this._textDomEl), L.point(40, -65), disable3D = 0);
            _this._d3text = d3.select(".paratext-info").append("ul").style("list-style-type", "none").style("padding-left", "0px").attr("width", $(_this._m.getContainer())[0].clientWidth / 3).attr("height", $(_this._m.getContainer())[0].clientHeight - 80);
            _this._d3li = _this._d3text.selectAll("li").data(_this.text).enter().append("li");
            _this._d3li.style("font-family", "Helvetica").style("line-height", "2").style("border", "2px solid gray").style("margin-top", "10px").style("padding-right", "20px").style("padding-left", "40px").attr("id", function(d, i) {
              return "line-" + i;
            }).text(function(d, i) {
              var timeout;
              _this._leafletli = L.DomUtil.get("line-" + i);
              timeout = void 0;
              L.DomEvent.addListener(_this._leafletli, 'click', function(e) {
                e.stopPropagation();
                _this.removeAnyLocation();
                _this.setViewByLocation(d);
                _this.showLocation(d);
                if (_this._viewSet === void 0) {
                  return _this._viewSet = _this._m.getCenter();
                }
              });
              L.DomEvent.addListener(_this._leafletli, 'mouseout', function(e) {
                timeout = 0;
                e.stopPropagation();
                setTimeout((function() {
                  $(L.DomUtil.get(_this._domEl)).animate({
                    opacity: 0
                  }, 100, function() {});
                }));
                return _this.removeAnyLocation();
              });
              L.DomEvent.addListener(_this._leafletli, 'mouseover', function(e) {
                $(this).css('cursor', 'pointer');
                e.stopPropagation();
                _this.clearMap();
                _this.removeAnyLocation();
                timeout = setTimeout(function() {
                  _this._m._initPathRoot();
                  if (timeout !== 0) {
                    console.log("d", d);
                    _this.setViewByLocation(d);
                    _this.showLocation(d);
                    timeout = 0;
                    if (_this._viewSet === void 0) {
                      return _this._viewSet = _this._m.getCenter();
                    }
                  }
                }, 900);
              }, function() {});
              return d.description;
            }).style("font-size", "16px").style("color", "rgb(72,72,72)").on("mouseover", function(d, i) {
              $(this).css('cursor', 'pointer');
              d3.select(this).transition().duration(0).style("color", "black").style("background-color", "rgb(208,208,208) ").style("opacity", 1);
            }).on("mouseout", function(d, i) {
              d3.select(this).transition().duration(1000).style("color", "rgb(72,72,72)").style("background-color", "white").style("opacity", 1);
            }).transition().duration(1).delay(1).style("opacity", 1);
            _this._m.whenReady(function() {
              return _this._m.setView([42.34, -71.12], 13);
            });
            return _this._textDomEl;
          };
        })(this),
        onSetView: (function(_this) {
          return function(map) {
            return _this._m = map;
          };
        })(this)
      });
      this._m.addControl(new textControl());
      this._m.on('viewreset', (function(_this) {
        return function() {
          return _this.vizAllLocations();
        };
      })(this));
      this._m.on('moveend', (function(_this) {
        return function() {
          return _this.vizAllLocations();
        };
      })(this));
      return this._m;
    },
    connectRelation: function() {
      return this.raw_text = this.properties.text;
    }
  });

  L.paratext = function(text) {
    return new L.ParaText(text);
  };

  addChainedAttributeAccessor = function(obj, propertyAttr, attr) {
    return obj[attr] = function() {
      var newValues;
      newValues = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (newValues.length === 0) {
        return obj[propertyAttr][attr];
      } else {
        obj[propertyAttr][attr] = newValues[0];
        return obj;
      }
    };
  };

  true;

  paratext.VERSION = '0.0.0';

  root.paratext = paratext;

}).call(this);


}(this));
