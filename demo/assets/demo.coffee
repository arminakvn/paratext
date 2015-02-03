queue().defer(d3.csv, "ccn_18062014_data.csv").await (err, texts) ->
  draw texts
  return

draw = (data) ->
  ### 

  show context and hide context are commented at in listners for the list objects
  leaflet polylines currently used for drawing connections between text and location is 
  not appropriate for nice transitions -- 
  
  ###
  console.log L
  paratextVar = L.paratext(data)
  textmap = paratextVar.makeMap()
  texts = d3.selectAll("li")
  paratextVar.field_category('service_name')
  
  paratextVar.makeRelations()
  # paratextVar.listStacker()
  paratextVar.vizAllLocations()
  paratextVar.makeDiv2("div3")
  # the div controler could be removed from map using leaflet's .removerLayer methods
  # paratextVar.vizLocation()
  ### 
  
  bding the L.D3 to jQuery and assiging data from and to datum
  
  ###
  $texts = $(texts[0])
  $texts.each ->
    $(this).data "datum", $(this).prop("__data__")
    return