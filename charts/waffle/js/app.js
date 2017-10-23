    d3.csv("data/data.csv", function(err, data) {
      if (err) {
        console.error(err);
      } else {
        var waffle = new WaffleChart()
          .selector("#vis")
          .data(data)
          .useWidth(true)
          .size(12)
          .gap(2)
          .rows(30)
          .columns(20)
          .rounded(true)();
      }
    });