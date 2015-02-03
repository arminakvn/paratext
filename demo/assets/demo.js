(function() {
  var draw;

  queue().defer(d3.csv, "ccn_18062014_data.csv").await(function(err, texts) {
    draw(texts);
  });

  draw = function(data) {

    /* 
    
    show context and hide context are commented at in listners for the list objects
    leaflet polylines currently used for drawing connections between text and location is 
    not appropriate for nice transitions --
     */
    var $texts, paratextVar, textmap, texts;
    console.log(L);
    paratextVar = L.paratext(data);
    textmap = paratextVar.makeMap();
    texts = d3.selectAll("li");
    paratextVar.field_category('service_name');
    paratextVar.makeRelations();
    paratextVar.vizAllLocations();
    paratextVar.makeDiv2("div3");

    /* 
    
    bding the L.D3 to jQuery and assiging data from and to datum
     */
    $texts = $(texts[0]);
    return $texts.each(function() {
      $(this).data("datum", $(this).prop("__data__"));
    });
  };

}).call(this);
