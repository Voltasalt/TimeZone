$(function() {
  var draw = function() {
    var hash = window.location.hash;

    if (hash) {
      var sections = hash.substr(1).split("/");

      var timeStr, dateStr, zoneStr;
      if (sections.length == 1) {
        zoneStr = sections[0];
      } else if (sections.length == 2) {
        timeStr = sections[0];
        zoneStr = sections[1];
      } else if (sections.length == 3) {
        dateStr = sections[0];
        timeStr = sections[1];
        zoneStr = sections[2];
      }
      zoneStr = zoneStr.replace(/,/g, "/");

      var zone = "";
      moment.tz.names().forEach(function(z) {
        if (z.toLowerCase().replace(/_/g, "") == zoneStr.toLowerCase()) {
          zone = z;
        } else if (z.split("/").pop().toLowerCase().replace(/_/g, "") == zoneStr.toLowerCase()) {
          zone = z;
        }
      });

      if (dateStr) {
        var date = moment.tz(dateStr, ["YYYY-MM-DD", "MM-DD-YYYY", "DD-MM-YYY", "Do MMM YYYY", "Do of MMM YYYY", "DD MMM YYY", "MMM DD YYYY", "MMM Do YYYY", "DD MM YY", "DD MM, YY"], zone);
      } else {
        var date = moment.tz(zone);
      }
      if (timeStr) {
        var time = moment(timeStr, ["HH:mm", "hh:mm A", "HH:mm:ss", "hh:mm:ss A", "HH", "hh A"]);
      } else {
        var time = moment().tz(zone);
      }
      date.hours(time.hours()).minutes(time.minutes()).seconds(time.seconds());

      $(".date-top").text(date.format("MMMM Do, YYYY"));
      $(".time-top").text(date.format("HH:mm:ss"));
      $(".zone-top").text(zone.replace(/_/g, " "));

      var converted = moment(date).local();

      $(".date-bot").text(converted.format("MMMM Do, YYYY"));
      $(".time-bot").text(converted.format("HH:mm:ss"));
      $(".zone-bot").text("your time");

      $(".year").val(date.year());
      $(".month").selectpicker("val", date.month());
      $(".day").selectpicker("val", date.date());
      $(".hour").selectpicker("val", date.hour());
      $(".minute").selectpicker("val", date.minute());
      $(".second").selectpicker("val", date.second());
      $(".z").selectpicker("val", zone);
    }
  }

  window.onhashchange = draw;

  for (var i = 0; i < 12; i++) {
    $(".month").append($("<option></option>").text(moment().month(i).format("MMMM")).attr("value", i));
  }

  for (var i = 0; i < 31; i++) {
    $(".day").append($("<option></option>").text(moment().date(i+1).format("Do")).attr("value", i+1));
  }

  for (var i = 0; i < 24; i++) {
    $(".hour").append($("<option></option>").text(moment().hour(i).format("HH")).attr("value", i));
  }

  for (var i = 0; i < 60; i++) {
    $(".minute").append($("<option></option>").text(moment().minute(i).format("mm")).attr("value", i));
  }

  for (var i = 0; i < 60; i++) {
    $(".second").append($("<option></option>").text(moment().second(i).format("ss")).attr("value", i));
  }

  if (!window.location.hash) {
    var newDate = moment();
    window.location.hash = "#" + newDate.format("YYYY-MM-DD") + "/" + newDate.format("HH:mm:ss") + "/UTC";
  }

  var updateHash = function() {
    var newDate = moment({
      year: parseInt($(".year").val()),
      month: parseInt($(".month").val()),
      date: parseInt($(".day").val()),
      hour: parseInt($(".hour").val()),
      minute: parseInt($(".minute").val()),
      second: parseInt($(".second").val())
    });
    window.location.hash = "#" + newDate.format("YYYY-MM-DD") + "/" + newDate.format("HH:mm:ss") + "/" + $(".z").val().replace(/\//g, ",");
  }

  $(".month").change(updateHash);
  $(".year").change(updateHash);
  $(".day").change(updateHash);
  $(".hour").change(updateHash);
  $(".minute").change(updateHash);
  $(".second").change(updateHash);
  $(".z").change(updateHash);

  $(".now").click(function() {
    var newDate = moment().tz($(".z").val());
    window.location.hash = "#" + newDate.format("YYYY-MM-DD") + "/" + newDate.format("HH:mm:ss") + "/" + $(".z").val().replace(/\//g, ",");
  });

  moment.tz.names().forEach(function(zone) {
    var elements = zone.split("/");
    elements.reverse();
    if (elements[1] == "Etc") elements.pop();
    elements.reverse();

    $(".z").append($("<option></option>").text(elements.join("/")).attr("value", zone));
  });

  $('.selectpicker').selectpicker();

  draw();
});
