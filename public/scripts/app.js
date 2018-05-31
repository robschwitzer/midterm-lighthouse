$(() => {

getDocs(getComments);

});


const getDocs = (cb) => {
  $.ajax({
    method: "GET",
    url: "/api/urls"
  }).done((docs) => {
    console.log(docs)
    docs.forEach((doc) => {
      
      const $title = $("<h1>").text(doc.title),
      $description = $("<p>").text(doc.$description),
      $url = $("<a>").text(doc.url).attr('href', doc.url),
      $doc = $('<div>').append($title, $description, $url).addClass('resource');
      
      cb(doc.id, $doc);

      $doc.appendTo('body');
    });
  });;
}

const getComments = (doc_id, $doc_div) => {
  $.ajax({
    method: "GET",
    url: "/api/comments"
  }).done((comments) => {
    console.log(comments)
    comments.forEach((packet) => {
      if(doc_id === packet.url_id) {
        $comment = $("<div>")
        .text(packet.comment)
        .appendTo($doc_div)
        .addClass('comment');
      }
    });
  });
}