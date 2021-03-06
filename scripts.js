$(document).ready( () => {

  const BASE_URL = 'https://smileschool-api.hbtn.info/';
  let dataPopularVideos = [];
  let dataLastestVideos = [];

  const loadQuotes = $.get(BASE_URL+'quotes', function (data, status) {
    if (status === 'success') {
      data.forEach((elemnt, idx) => {
        const { name, pic_url, text, title } = elemnt;

        const template = `
        <div class="carousel-item ${idx === 0 ? 'active' : ''}" data-interval="10000">
          <div class="container-carousel d-flex flex-column flex-sm-row" >
            <div class="text-center">
              <img src="${pic_url}" class="rounded-circle" width="150" height="150" alt="testimonial">
            </div>
            <blockquote class="text-white ml-3 d-flex flex-column justify-content-center mb-0">
              <p class="font-italic font-weight-light">
                  « ${text} »
              </p>
              <p class="font-weight-bold mb-2">${name} <br> <span class="font-italic font-weight-light">${title}</span></p>
          </blockquote>
          </div>
        </div>
        `;

        $('#carousel-testimonial').append(template);
        
      })
    }
  }).done(() => {
    $('.loader').css('display', 'none');
  })

  function loadCarouselVideos(url, container, loader, variable) {
    $.ajax({
      method: "GET",
      url: url
    })
    .done(function(data) {
      let cnt = 0;

      data.forEach(item => {

        let nextCard = cnt == data.length -1 ? 0 : cnt + 1;
        let prevCard = cnt == 0 ? data.length -1 : cnt - 1;

        let card = $(
          '<div class="card border-0 mr-2" style="width: 16rem;" attr-next="' + nextCard + '" attr-prev="' + prevCard + '">' +
            '<div class="d-flex align-items-center justify-content-center">' +
              '<img src="' + item.thumb_url + '" alt="Video #1" class="card-img-top">' +
              '<img src="images/play.png" alt="Video #1" class="position-absolute w-25">' +
            '</div>' +
            '<div class="card-body">' +
              '<h5 class="card-title font-weight-bold text-dark">' + item.title + '</h5>' +
            '</div>' +
            '<ul class="list-group list-group-flush">' +
              '<li class="list-group-item border-0 color-grey-smile">' + item['sub-title'] + '</li>' +
              '<li class="list-group-item d-flex align-item-center border-0">' +
                '<img class="rounded-circle" src="' + item.author_pic_url + '" alt="Profile 1" width="30" height="30">' +
                '<p class="pl-3 color-smile my-auto">' + item.author + '</p>' +
              '</li>' +
              '<li class="list-group-item d-flex border-0">' +
                '<div class="col-8 text-left pl-0">' +
                  '<img src="images/star_on.png" width="23">' +
                  '<img src="images/star_on.png" width="23">' +
                  '<img src="images/star_on.png" width="23">' +
                  '<img src="images/star_on.png" width="23">' +
                  '<img src="images/star_off.png" width="23">' +
                '</div>' +
                '<div class="col-4 color-smile text-right pt-1 px-0">' +
                  '<span>' + item.duration + '</span>' +
                '</div>' +
              '</li>' +
            '</ul>' +
          '</div>'
        );
        
        variable.push(card);
        cnt++;
      });

      //fill cards
      slidesCards("", container, variable);

      //hide loader
      $("#" + loader).hide();
    })
  }

  function itemToShow() {
    let size = $(window).width()

    if (size >= 1200)
      return 4;
    else if (size >= 992 && size <= 1199)
      return 3;
    else if (size >= 528 && size <= 991)
      return 2;
    else
      return 1;
  }

  function slidesCards(action, container, variable) {

    let itemtoShow = itemToShow();
    let shownItems = $("#" + container).children().length;

    if (action.localeCompare("") === 0) {
      for (let cnt = 0; cnt < itemtoShow; cnt++) {
        $("#" + container).append(variable[cnt]);
      }
    } else if (action.localeCompare("next") === 0 && shownItems != variable.length) {
      let nextCard = parseInt($("#" + container + " .card").last().attr("attr-next"));
      $("#" + container + " .card").first().remove();
      $("#" + container).append(variable[nextCard]);
    } else if(action.localeCompare("prev") === 0 && shownItems != variable.length) {
      let prevCard = parseInt($("#" + container + " .card").first().attr("attr-prev"))
      $("#" + container + " .card").last().remove();
      $("#" + container).prepend(variable[prevCard]);
    } else if (action.localeCompare("resize") == 0) {
      if (shownItems > itemtoShow) {
        for (let cnt = 0; cnt < shownItems - itemtoShow; cnt++) {
          $("#" + container + " .card").last().remove();
        }
      } else {
        for (let cnt = 0; cnt < itemtoShow - shownItems; cnt++) {
          let nextCard = $("#" + container + " .card").last().attr("attr-next");
          $("#" + container).append(variable[nextCard]);
        }
      }
    }
  }

  $(window).resize(function() {
    slidesCards("resize", "popularVideosContent", dataPopularVideos);
    slidesCards("resize", "latestVideosContent", dataLastestVideos);
  });

  // next popular videos
  $("#pv-next").click(function(){
    slidesCards("next", "popularVideosContent", dataPopularVideos);
  });

  // previous popular videos
  $("#pv-prev").click(function() {
    slidesCards("prev", "popularVideosContent", dataPopularVideos);
  });

  // next lates videos
  $("#lv-next").click(function(){
    slidesCards("next", "latestVideosContent", dataLastestVideos);
  });

  // previous latest videos
  $("#lv-prev").click(function() {
    slidesCards("prev", "latestVideosContent", dataLastestVideos);
  });


  function fillInputs() {
    $.ajax({
      method: "GET",
      url: "https://smileschool-api.hbtn.info/courses",
      success: (data) => {
        
      }
    }).done((data) => {
      console.log(data);
      data.topics.forEach((item, idx) => {
        let option = $(`<option ${idx === 0 ? 'selected' : ''}> ${item} </option>`);
        $("#topicInput").append(option)
      })

      data.sorts.forEach((item, idx) => {
        let option = $(`<option ${idx === 0 ? 'selected' : ''}> ${item.replace("_", " ")} </option>`);
        $("#sortbyInput").append(option);
      })

      $("#sortbyInput").change(() => getCourses());
      $("#topicInput").change(() => getCourses());
      $("#keywords").change((e) => {
        e.preventDefault();
        getCourses()
      });

      getCourses();

    })
  }

  function getCourses() {
    const search = $("#keywords").val();
    const sortBy = $("#sortbyInput").val();
    const topic = $("#topicInput").val();
    console.log(search, sortBy, topic);

    $.ajax({
      method: "GET",
      url: "https://smileschool-api.hbtn.info/courses",
      data: {
        q: search,
        topic: topic,
        sort: sortBy
      }
    })
    .done((data) => {
      $("#numberOfVideos").html(data.courses.length + " video(s)");
      $("#results").html("");
      data.courses.forEach(item => {
        let card = 
          '<div class="d-flex col-12 col-sm-6 col-md-4 col-lg-3 px-sm-0">' +
            '<div class="card border-0 ml-2">' +
              '<div class="d-flex align-items-center justify-content-center">' +
                '<img src="' + item.thumb_url + '" alt="Video #1" class="card-img-top">' +
                '<img src="images/play.png" alt="Video #1" class="position-absolute w-25">' +
              '</div>' +
              '<div class="card-body">' +
                '<h5 class="card-title font-weight-bold text-dark">' + item.title + '</h5>' +
              '</div>' +
              '<ul class="list-group list-group-flush">' +
                '<li class="list-group-item border-0 color-grey-smile">' + item['sub-title'] + '</li>' +
                '<li class="list-group-item d-flex align-item-center border-0">' +
                  '<img class="rounded-circle" src="' + item.author_pic_url + '" alt="Profile 1" width="30" height="30">' +
                  '<p class="pl-3 color-smile my-auto">' + item.author + '</p>' +
                '</li>' +
                '<li class="list-group-item d-flex border-0">' +
                  '<div class="col-8 text-left pl-0">' +
                    '<img src="images/star_on.png" width="23">' +
                    '<img src="images/star_on.png" width="23">' +
                    '<img src="images/star_on.png" width="23">' +
                    '<img src="images/star_on.png" width="23">' +
                    '<img src="images/star_off.png" width="23">' +
                  '</div>' +
                  '<div class="col-4 color-smile text-right pt-1">' +
                    '<span>' + item.duration + '</span>' +
                  '</div>' +
                '</li>' +
              '</ul>' +
            '</div>' +
          '</div>';

          $("#results").append(card);

          $('.loader').hide();
      });


    })
  }



  if($('#courses')) {
    fillInputs();
  }

  loadCarouselVideos(BASE_URL+"popular-tutorials", "popularVideosContent", "loaderPopularVideos", dataPopularVideos);
  
  loadCarouselVideos(BASE_URL+"latest-videos", "latestVideosContent", "loaderLatestVideos", dataLastestVideos);


})