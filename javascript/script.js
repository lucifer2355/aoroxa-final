if ($.fn.imagesLoaded) {
  $(".radix-portfolio-filter").imagesLoaded(function() {
    // init Isotope
    var $grid = $(".radix-portfolio-filter").isotope({
      itemSelector: ".single-portfolio-item",
      filter: ".webDevelopment",
      percentPosition: true,
      masonry: {
        columnWidth: ".single-portfolio-item"
      }
    });

    // filter items on button click
    $(".portfolio-menu li div").on("click", "h3", function() {
      var filterValue = $(this).attr("data-filter");
      $grid.isotope({
        filter: filterValue
      });
    });
  });
}

$(".portfolio-menu li div").on("click", function() {
  $(".portfolio-menu li div").removeClass("active");
  $(this).addClass("active");
});
