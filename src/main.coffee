### paratext main ###

# Base function.

paratext = L.ParaText = L.Class.extend(
  includes: L.Mixin.Events
  options: 
    field_category: ''
  initialize: (@text, options) ->
    @properties=
        id: 0
        members: []
        _margin: 
          t: 20
          l: 30
          b: 30
          r: 30
        relations: []
        edges: []
        lat: 0
        long: 0
        # edges: [{
        #   nodes:[]
        #   rel_type:''
        #   rel_param: ''
        #   geometry:{
        #     geometry_type:''
        #     coordinates:[]
        #   }
        # }
        # ]
    _this = this
    L.setOptions _this, options
    return
  # addChainedAttributeAccessor(this, 'properties', attr) for attr of @properties
  addTo: (map) ->
    map.addLayer this
    this

  field_category: (newFieldCategory) ->
    @options.field_category = newFieldCategory
    this


  makeRelations: ->
    if @options.field_category isnt ''
      for key, value of @text
        @properties.edges.push {nodes: [key], rel_type: 'internal', rel_param: value[@options.field_category]}


  find_relations: (d) ->

    # going through the data and populating the properties.edges here maybe?
    # console.log d
    # for 

  show_contexts: (d, e) ->
    featureData = []
    featureData.push d[@options.field_category]
    onMapPosition = @_m.containerPointToLayerPoint([L.DomEvent.getMousePosition(e).x + $(@_m.getContainer())[0].clientWidth/6, $(@_m.getContainer())[0].clientHeight/4])
    _domEl = @makeDiv('context', onMapPosition)
    if @_d3obj
      _d3obj = @_d3obj
      d3.selectAll(document.getElementsByClassName("context span")).data([]).remove()
    else
      d3.selectAll(document.getElementsByClassName("context span")).data([]).remove()
    _d3obj = d3.select(_domEl).selectAll("span").data([]).remove()
    _d3obj = d3.select(_domEl).selectAll("span").data([d.description]).enter()
    console.log "_d3obj", _d3obj
    # @_d3obj = _d3obj
    _d3obj.append("span"
    ).text(""
    ).attr("class", "context span"
    ).text((d,i) =>
      return d
    )

  hide_context: ->
    _domEl = @_domEl if @_domEl
    L.DomUtil.setOpacity(_domEl, 0) if L.DomUtil.getStyle(_domEl, 'opacity') < 0.5


  makeDiv2: (name) ->
    divControl = L.Control.extend(  
      initialize: =>
        position = "topleft"
        _domEl = L.DomUtil.create('div', "container " + name + "-info")
        L.DomUtil.enableTextSelection(_domEl)  
        @_m.getContainer().getElementsByClassName("leaflet-control-container")[0].appendChild(_domEl)
        _domObj = $(L.DomUtil.get(_domEl))
        _domObj.css('width', $(@_m.getContainer())[0].clientWidth/3)
        _domObj.css('height', $(@_m.getContainer())[0].clientHeight/3)
        _domObj.css('background-color', 'white')
        L.DomUtil.setOpacity(L.DomUtil.get(_domEl), 0.75)
        L.DomUtil.setPosition(L.DomUtil.get(_domEl), L.point($(@_m.getContainer())[0].clientWidth/1.6, $(@_m.getContainer())[0].clientHeight/4), disable3D=0)
        fx = new L.PosAnimation()
        fx.run(L.DomUtil.get(_domEl), position, 0.9)
        _domEl = _domEl
    )
    new divControl()
    return #_domEl

  makeDiv: (name, position) ->
    divControl = L.Control.extend(  
      initialize: =>
        # _domEl = L.DomUtil.get("container " + name + "-info")
        if @_domEl
          _domEl = @_domEl
          L.DomUtil.setOpacity(_domEl, 0) if L.DomUtil.getStyle(_domEl, 'opacity') < 0.5
        else
          _domEl = L.DomUtil.create('div', "container " + name + "-info")
          L.DomUtil.enableTextSelection(_domEl)  
          @_m.getContainer().getElementsByClassName("leaflet-control-container")[0].appendChild(_domEl)
        _domObj = $(L.DomUtil.get(_domEl))
        _domObj.css('width', $(@_m.getContainer())[0].clientWidth/6)
        _domObj.css('height', $(@_m.getContainer())[0].clientHeight/6)
        _domObj.css('background-color', 'white')
        L.DomUtil.setOpacity(L.DomUtil.get(_domEl), 0.7)
        L.DomUtil.setPosition(L.DomUtil.get(_domEl), L.point($(@_m.getContainer())[0].clientWidth/2, $(@_m.getContainer())[0].clientHeight/2 + $(@_m.getContainer())[0].clientHeight/4), disable3D=0)
        fx = new L.PosAnimation()
        fx.run(L.DomUtil.get(_domEl), position, 0.9)
        @_domEl = _domEl
    )
    new divControl()
    return @_domEl

  listStacker: ->
    _d3_obj = d3.selectAll(@_d3li)
    for each in _d3_obj[0]
      console.log "each", each
    for each in _d3_obj[0][0]
      console.log each.__data__


  clearMap: ->
    # console.log  @_m._layers
    for i of @_m._layers
      if @_m._layers[i]._path?
        # console.log  @_m._layers[i]._path
        try
          # console.log i, @_m._layers[i]
          @_m.removeLayer @_m._layers[i]
          # console.log i, @_m._layers[i]
        catch e
          @_m.removeLayer @_m._layers[i]._path
          # console.log "problem with "+ i + e + @_m._layers[i]
          continue
    return
  vizAllLocations: ->
    @_m.on "load moveend viewreset zoomend", =>
      @clearMap() if @_polyline
      _d3_obj = d3.selectAll(@_d3li)
      for each in _d3_obj[0][0]
        # if (L.DomUtil.getViewportOffset(document.getElementById(d3.select(each).property('id'))).y < $(@_m.getContainer())[0].clientHeight) and (@_m.getBounds().contains(@_m.layerPointToLatLng(@_m.latLngToLayerPoint(L.latLng(each.__data__.lat, each.__data__.long)))))
        @vizLocation(each.__data__, d3.select(each).property('id').replace('line-', ''))
    
  vizLocation: (d, i) ->
    @_m.on "moveend viewreset zoomend", =>
      if @_polyline
        _polyline = @_polyline
      points = []
      if @_m.getBounds().contains(@_m.layerPointToLatLng(@_m.latLngToLayerPoint(L.latLng(d.lat, d.long)))) and (@_m.getBounds().contains(@_m.layerPointToLatLng(@_m.containerPointToLayerPoint([L.DomUtil.getViewportOffset(document.getElementById("line-#{i}")).x + 20 + $(@_m.getContainer())[0].clientWidth/3, L.DomUtil.getViewportOffset(document.getElementById("line-#{i}")).y]))))
        points.push @_m.layerPointToLatLng(@_m.latLngToLayerPoint(L.latLng(d.lat, d.long)))
        points.push @_m.layerPointToLatLng(@_m.containerPointToLayerPoint([L.DomUtil.getViewportOffset(document.getElementById("line-#{i}")).x + 30 + $(@_m.getContainer())[0].clientWidth/3, L.DomUtil.getViewportOffset(document.getElementById("line-#{i}")).y]))
      else
        points = []
      _polyline = L.polyline(points, {
        color: 'blue'
        opacity: 0.8 
        weight: 0.9
        })
      _polyline.on 'add', =>
        _polyline.bringToFront()
        timeout = 0
        setTimeout (->
          $(L.DomUtil.get(_this._polyline._container)).animate
            opacity: 0
          , 4000, ->

          return

        # Animation complete.
        )
      @_polyline = _polyline
      
      _polyline.addTo(@_m)
    return @_m


  getD3: ->
    @_count = 0
    @_canvas = $(".canvas")
    @_width = @_canvas.width() - @properties._margin.l - @properties._margin.r
    @_height = @_canvas.height() - @properties._margin.t - @properties._margin.b
    @_svg = d3.select(".").append("svg").attr("width", @_width + @properties._margin.l + @properties._margin.r).attr("height", @_height + @properties._margin.t + @properties._margin.b).append("g").attr("transform", "translate(" + @properties._margin.l + "," + @properties._margin.t + ")")
    @_svg.selectAll("text").data(@properties.text).enter().append("text").attr("width", 2400).attr("height", 200)
    .style("font-family", "Impact").attr("fill", "black").text((d) ->
      d.description
    ).on("mouseover", ->
      d3.select(this).transition().duration(300).style "fill", "gray"
      # 
      return
    ).on("mouseout", ->
      d3.select(this).transition().duration(300).style "fill", "black"
      return
    ).transition().delay(0).duration(1).each("start", ->
      d3.select(this).transition().duration(1).attr "y", ((@_count + 1) * 30)
      @_count = @_count + 1
      return
    ).transition().duration(11).delay(1).style "opacity", 1
    @_count = @_count + 1
    return @_svg
  
  
               #val for key, val of d # new L.LatLng(d.lat, d.long)
  removeAnyLocation: ->
    d3.select(@_m.getPanes().overlayPane).select(".leaflet-zoom-animated").selectAll("g")
    .data([]).exit().remove()

  setViewByLocation: (d)-> 
    @_m.setView(new L.LatLng(d.lat, d.long), 19, animation: true, duration: 50)

  showLocation: (d) ->
    featureData =[]
    featureData.push new L.LatLng(d.lat, d.long)
    @_g = d3.select(@_m.getPanes().overlayPane).select(".leaflet-zoom-animated").selectAll("g")
    @_g.data(featureData).enter().append("g").append("circle").attr("r", 0
    ).attr("stroke", "white"
    ).attr("fill", "none"
    ).attr("stroke-width", "10"
    ).attr("cx", (d) =>
      return @_m.latLngToLayerPoint(d).x
    ).attr("cy", (d) =>
      return @_m.latLngToLayerPoint(d).y
    ).transition().delay(120).duration(1000).attr("r", 80
    ).attr("stroke", "gray"
    ).attr("stroke-width", "1"
    ).attr("fill", "none"
    ).transition().delay(120).duration(1000).attr("r", 40
    ).attr("stroke", "gray"
    ).attr("stroke-width", "2"
    ).attr("fill", "none")

  makeMap: ->
    map = $("body").append("<div id='map'></div>")
    L.mapbox.accessToken = "pk.eyJ1IjoiYXJtaW5hdm4iLCJhIjoiSTFteE9EOCJ9.iDzgmNaITa0-q-H_jw1lJw"
    @_m = L.mapbox.map("map", "arminavn.ib1f592g",
      zoomAnimation: true
      zoomAnimationThreshold: 4
      inertiaDeceleration: 4000
      animate: true
      duration: 1.75
      easeLinearity: 0.1
      )
    @_m.setView([
            42.34
            -71.12
          ], 13)
    # @_m.dragging.disable()
    @_m.boxZoom.enable()
    @_m.scrollWheelZoom.disable()
    textControl = L.Control.extend(
      options:
        position: "topleft"
      onAdd: (map) =>
        @_m = map  
          # create the control container with a particular class name

        @_textDomEl = L.DomUtil.create('div', 'container paratext-info')
        @_el = L.DomUtil.create('svg', 'svg')
        @_m.getPanes().overlayPane.appendChild(@_el)
        # @_textDomEl_innerdiv = L.DomUtil.create('div', 'container paratext-info', 'container paratext-info')
        L.DomUtil.enableTextSelection(@_textDomEl)  
        @_m.getPanes().overlayPane.appendChild(@_textDomEl)
        @_textDomObj = $(L.DomUtil.get(@_textDomEl))
        @_textDomObj.css('width', $(@_m.getContainer())[0].clientWidth/3)
        @_textDomObj.css('height', $(@_m.getContainer())[0].clientHeight)
        @_textDomObj.css('background-color', 'white')
        @_textDomObj.css('overflow', 'scroll')
        L.DomUtil.setOpacity(L.DomUtil.get(@_textDomEl), .8)
        # here it needs to check to see if there is any vewSet avalable if not it should get it from the lates instance or somethign
        @_viewSet = @_m.getCenter() if @_viewSet is undefined
        L.DomUtil.setPosition(L.DomUtil.get(@_textDomEl), L.point(40, -65), disable3D=0)
        @_d3text = d3.select(".paratext-info")
        .append("ul").style("list-style-type", "none").style("padding-left", "0px")
        .attr("width", $(@_m.getContainer())[0].clientWidth/3 )
        .attr("height", $(@_m.getContainer())[0].clientHeight-80)
        @_d3li = @_d3text
        .selectAll("li")
        .data(@text)
        .enter()
        .append("li")
        @_d3li.style("font-family", "Helvetica")
        .style("line-height", "2")
        .style("border", "2px solid gray")
        .style("margin-top", "10px")
        .style("padding-right", "20px")
        .style("padding-left", "40px")
        .attr("id", (d, i) =>
           "line-#{i}" 
          )
        .text((d,i) =>
          @_leafletli = L.DomUtil.get("line-#{i}")
          timeout = undefined
          L.DomEvent.addListener @_leafletli, 'click', (e) ->
            e.stopPropagation()
            # _this.hide_context()
            _this.removeAnyLocation()
            _this.setViewByLocation(d)
            _this.showLocation(d)
            _this._viewSet = _this._m.getCenter() if _this._viewSet is undefined
             # showLocation(d)
          L.DomEvent.addListener @_leafletli, 'mouseout', (e) ->
            timeout = 0
            e.stopPropagation()
            setTimeout (->
              $(L.DomUtil.get(_this._domEl)).animate
                opacity: 0
              , 100, ->

              return

            # Animation complete.
            )
            # L.DomUtil.setOpacity(L.DomUtil.get(_this._domEl), 0)
            _this.removeAnyLocation()

          L.DomEvent.addListener @_leafletli, 'mouseover', (e) ->
            # L.DomUtil.getViewportOffset(_domEl)
            $(this).css('cursor','pointer')
            e.stopPropagation()
            _this.clearMap()
            _this.removeAnyLocation()
            timeout = setTimeout(->
              _this._m._initPathRoot()
              if timeout isnt 0 
                console.log "d", d
                _this.setViewByLocation(d)
                _this.showLocation(d)
                # _this.vizLocation(d, i)
                
                # _this.find_relations(d)
                # _this.show_contexts(d, e)
                timeout = 0
                _this._viewSet = _this._m.getCenter() if _this._viewSet is undefined
            , 900)
            return 
          , ->
            return
          d.description   
        )
        .style("font-size", "16px")
        .style("color", "rgb(72,72,72)" )
        .on("mouseover", (d,i) ->
          $(this).css('cursor','pointer')
          d3.select(this).transition().duration(0).style("color", "black").style("background-color", "rgb(208,208,208) ").style "opacity", 1
          return 
        ).on("mouseout", (d,i) ->
          d3.select(this).transition().duration(1000).style("color", "rgb(72,72,72)").style("background-color", "white").style "opacity", 1
          return
        )  
        .transition().duration(1).delay(1).style("opacity", 1)
        @_m.whenReady =>
          @_m.setView([
            42.34
            -71.12
          ], 13)
        @_textDomEl
      onSetView: (map) =>
        @_m = map


    )

    @_m.addControl new textControl()
    @_m.on 'viewreset', =>
      @vizAllLocations()
    @_m.on 'moveend', =>
      @vizAllLocations()
  
    return @_m

  connectRelation: ->
    @raw_text = @properties.text
  )
L.paratext = (text) ->
  new L.ParaText(text)

addChainedAttributeAccessor = (obj, propertyAttr, attr) ->
    obj[attr] = (newValues...) ->
        if newValues.length == 0
            obj[propertyAttr][attr]
        else
            obj[propertyAttr][attr] = newValues[0]
            obj
	
# addChainedAttributeAccessor(this, 'properties', attr) for attr of @properties
# addChainedAttributeAccessor(this, 'options', attr) for attr of @options
  # Add functionality here.
true

# Version.
paratext.VERSION = '0.0.0'
# Export to the root, which is probably `window`.
root.paratext = paratext

# ---
# generated by js2coffee 2.0.0