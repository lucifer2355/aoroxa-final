if ($.fn.imagesLoaded) {
  $(".radix-portfolio-filter").imagesLoaded(function () {
    var a = $(".radix-portfolio-filter").isotope({
      itemSelector: ".single-portfolio-item",
      filter: ".webDevelopment",
      percentPosition: true,
      masonry: { columnWidth: ".single-portfolio-item" },
    });
    $(".portfolio-menu li").on("click", "div", function () {
      var b = $(this).attr("data-filter");
      a.isotope({ filter: b });
    });
  });
}
$(".portfolio-menu li div").on("click", function () {
  $(".portfolio-menu li div").removeClass("active");
  $(this).addClass("active");
});
