$(function() {
  var zoneTime;
  var localTime;

  var draw = function() {
    var hash = window.location.hash;

    if (hash) {
      var sections = hash.substr(1).split(" | ");

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
      zoneTime = date;

      $(".date-top").text(date.format("MMMM Do, YYYY"));
      $(".time-top").text(date.format("HH:mm:ss"));
      $(".zone-top").text(zone.replace(/_/g, " "));

      var converted = moment(date).local();
      localTime = converted;

      $(".date-bot").text(converted.format("MMMM Do, YYYY"));
      $(".time-bot").text(converted.format("HH:mm:ss"));
      $(".zone-bot").text("your time");

      $(".date-input").val(zoneTime.format("MMMM Do, YYYY"));
      $(".time-input").val(zoneTime.format("HH:mm:ss"));
      $(".z").selectpicker("val", zone);

      $(".until").text(moment().to(converted));
    }
  }

  window.onhashchange = draw;

  if (!window.location.hash) {
    var newDate = moment();
    window.location.hash = "#" + newDate.format("YYYY-MM-DD") + " | " + newDate.format("HH:mm:ss") + " | UTC";
  }

  var updateHash = function() {
    window.location.hash = "#" + $(".date-input").val() + " | " + $(".time-input").val() + " | " + $(".z").val();
  }

  $(".date-input").change(updateHash);
  $(".time-input").change(updateHash);
  $(".z").change(updateHash);

  $(".now").click(function() {
    var newDate = moment().tz($(".z").val());
    window.location.hash = "#" + newDate.format("YYYY-MM-DD") + " | " + newDate.format("HH:mm:ss") + " | " + $(".z").val();
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

  setInterval(function() {
    $(".until").text(moment().to(localTime));
  }, 500);
});
