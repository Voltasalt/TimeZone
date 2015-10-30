$(function() {
  var zoneTime;
  var localTime;

  var findZone = function(zoneStr) {
    var zone;
    moment.tz.names().forEach(function(z) {
      if (z.toLowerCase().replace(/_/g, "").replace(/ /g, "") == zoneStr.replace(/_/g, "").replace(/ /g, "").toLowerCase()) {
        zone = z;
      } else if (z.split("/").pop().toLowerCase().replace(/_/g, "").replace(/ /g, "") == zoneStr.replace(/_/g, "").replace(/ /g, "").toLowerCase()) {
        zone = z;
      }
    });
    return zone;
  }

  var draw = function() {
    var hash = window.location.hash.replace(/_/g, " ");

    if (hash) {
      var sections = decodeURIComponent(hash.substr(1)).split(" | ");

      var timeStr, dateStr, fromZoneStr, toZoneStr;
      if (sections.length == 1) {
        fromZoneStr = sections[0];
      } else if (sections.length == 2) {
        timeStr = sections[0];
        fromZoneStr = sections[1];
      } else if (sections.length == 3) {
        dateStr = sections[0];
        timeStr = sections[1];
        fromZoneStr = sections[2];
      } else if (sections.length == 4) {
        dateStr = sections[0];
        timeStr = sections[1];
        fromZoneStr = sections[2];
        toZoneStr = sections[3];
      }

      var fromZone = findZone(fromZoneStr) || "Local";
      var toZone = !toZoneStr ? "Local" : (findZone(toZoneStr) || "Local");

      var dateFormats = ["YYYY-MM-DD", "MM-DD-YYYY", "DD-MM-YYY", "Do MMM YYYY", "Do of MMM YYYY", "DD MMM YYY", "MMM DD YYYY", "MMM Do YYYY", "DD MM YY", "DD MM, YY"];
      var timeFormats = ["HH:mm", "hh:mm A", "HH:mm:ss", "hh:mm:ss A", "HH", "hh A"];
      if (dateStr) {
        if (fromZone != "Local") {
          var date = moment.tz(dateStr, dateFormats, fromZone);
        } else {
          var date = moment(dateStr, dateFormats);
        }
      } else {
        if (fromZone != "Local") {
          var date = moment.tz(fromZone);
        } else {
          var date = moment();
        }
      }

      if (timeStr) {
          var time = moment(timeStr, timeFormats);
      } else {
        if (fromZone != "Local") {
          var time = moment().tz(fromZone);
        } else {
          var time = moment();
        }
      }
      date.hours(time.hours()).minutes(time.minutes()).seconds(time.seconds());
      zoneTime = date;

      $(".date-top").text(date.format("MMMM Do, YYYY"));
      $(".time-top").text(date.format("HH:mm:ss"));
      $(".zone-top").text(fromZone == "Local" ? "your time" : moment.tz.zone(fromZone).abbr(date));

      if (toZone == "Local") {
        var converted = moment(date).local();
      } else {
        var converted = moment(date).tz(toZone);
      }
      localTime = converted;

      $(".date-bot").text(converted.format("MMMM Do, YYYY"));
      $(".time-bot").text(converted.format("HH:mm:ss"));
      $(".zone-bot").text(toZone == "Local" ? "your time" : moment.tz.zone(toZone).abbr(date));

      $(".date-input").val(zoneTime.format("MMMM Do, YYYY"));
      $(".time-input").val(zoneTime.format("HH:mm:ss"));
      $(".z-from").selectpicker("val", fromZone.replace("Etc/", "").replace(/_/g, " "));
      $(".z-to").selectpicker("val", toZone.replace("Etc/", "").replace(/_/g, " "));

      $(".until").text(moment().to(converted));
    }
  }

  window.onhashchange = draw;

  if (!window.location.hash) {
    var newDate = moment.tz("UTC");
    window.location.hash = ("#" + newDate.format("YYYY-MM-DD") + " | " + newDate.format("HH:mm:ss") + " | UTC | Local").replace(/ /g, "_");
  }

  var updateHash = function() {
    window.location.hash = ("#" + $(".date-input").val() + " | " + $(".time-input").val() + " | " + $(".z-from").val() + " | " + $(".z-to").val()).replace(/ /g, "_");
  }

  $(".date-input").change(updateHash);
  $(".time-input").change(updateHash);
  $(".z-from").change(updateHash);
  $(".z-to").change(updateHash);

  $(".now").click(function() {
    var newDate = moment().tz(findZone($(".z-from").val()));
    window.location.hash = ("#" + newDate.format("YYYY-MM-DD") + " | " + newDate.format("HH:mm:ss") + " | " + $(".z-from").val() + " | " + $(".z-to").val()).replace(/ /g, "_");
  });

  moment.tz.names().forEach(function(zone) {
    zone = zone.replace("Etc/", "").replace(/_/g, " ");
    $(".z-from").append($("<option></option>").text(zone).attr("value", zone));
    $(".z-to").append($("<option></option>").text(zone).attr("value", zone));
  });

  $('.selectpicker').selectpicker();

  draw();

  setInterval(function() {
    $(".until").text(moment().to(localTime));
  }, 500);

  window.findZone = findZone;
});
