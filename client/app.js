// Global undefined variable that will be used to reference each chirps id properly
let id;
// Global variable used to add a unique id to each chirps modal, before the modals were being combined.
// If one was opened then closed and another was opened it would contain the previous modals contents
let modalId = 1;
// This get request runs as soon as the page loads, it makes a call to the API as a get request for ALL chirps
// Data gets returned BUT our data is an object so some methods are needed so it becomes usable
$.get("http://localhost:3000/api/chirps", data => {
  // This is my janky way of keeping track of id's, ask me why i did this. Itll be easier to explain
  console.log(data);
  id = data.nextid;
  // I use the Object.values() method to turn each property of the single object into an array of objects
  let dataArr = Object.values(data);
  // I log the data to mame sure it is correct
  console.log(dataArr);
  // I do a standard for loop to loop through the array of chirp objects, I start at the end of the object so newest chirps are on top
  // The - 2 is necessary because the last property of the object is always the 'nextid' property, we dont want that showing up!
  for (let i = dataArr.length - 2; i >= 0; i--) {
    // Each chirp gets a card
    let card = $("<div class='card py-3'></div>");
    // Each chirp gets a card body
    let cardBody = $("<div class='card-body text-center'></div>");
    // The message of each chirp will be a p element
    let p = $(`<p class='card-text'>${dataArr[i].message}</p>`);
    // Each chirp will also have a button to delete it if necessary, the button calls a function called delete chirp if clicked
    // The interpolation you see is me passing in the id of the chirp to the delete function so only this chirp is deleted.
    let button = $(`<button type="button" class="close" aria-label="Close" onclick='deleteChirp(${
      dataArr[i].id
    })'>
      <span aria-hidden="true">&times;</span>
    </button>`);
    // Each chirp has its own modal for updating, i use the global modalId variable here so each modal references its specific chirp
    let modal = $(`<div class="modal fade" id="example${modalId}Modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
<div class="modal-dialog" role="document">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
        <input class="form-control" id="modal-input${dataArr[i].id}" value='${
      dataArr[i].message
    }' >
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" onclick="updateChirp(${
              dataArr[i].id
            })">Update Chirp</button>
        </div>
    </div>
</div>
</div>`);
    // Each chirp has a update button which triggers its specific modal. Remember, if i only used 1 modal the contents would start over
    // lapping, so each chirp needs its own personal modal to reference
    let modalBtn = $(`<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#example${modalId}Modal">
Edit Chirp
</button>`);
    // Below is me piecing together all of these jquery elements to be rendered on my html.
    cardBody.append(p);
    cardBody.append(modalBtn);
    cardBody.append(button);
    card.append(cardBody);
    $("body").append(modal);
    $(".container").append(card);
    // Lastly increment that modalId by 1 so each chirps modal is unique, for example, chirp 3 will have a button that triggeres modal 3.
    // There is no way for it to accidently trigger the wrong chirps modal
    modalId++;
  }
});
// Function is called on click for posting a new chirp
// I ran into issues before on referencing id's correctly, so i created a way for the id of the chirp to be added as a
// property of the actual chirp object. So if the next chirp to be made will have an ID of 11, when it is posted
// a property of id with a value of 11 will get added. This way the whole chirp object has the message AND id.
function postChirp() {
  let mes = $("#chirp-val").val();
  $.ajax({
    type: "POST",
    url: "/api/chirps/",
    data: JSON.stringify({
      message: mes,
      id: id
    }),
    contentType: "application/json"
  })
    .done(r => {
      console.log(r);
      location.reload();
    })
    .fail(err => {
      console.log(err);
    });
}
// Function is called when the delete button is pressed, remember above the id for the chirp is passed into this function
function deleteChirp(id) {
  $.ajax({
    url: `/api/chirps/${id}`,
    type: "DELETE",
    success: function() {
      location.reload();
    }
  });
}
// Function called to update a chirp, the modal has a update chirp button which calls this,
// Update chirp in the backend route takes 2 parameters, the id in the API route (req.params.id) and the body.
function updateChirp(id) {
  let mes = $(`#modal-input${id}`).val();
  $.ajax({
    type: "PUT",
    url: `/api/chirps/${id}`,
    data: JSON.stringify({
      message: mes,
      id: id
    }),
    contentType: "application/json"
  })
    .done(r => {
      console.log(r);
      location.reload();
    })
    .fail(err => {
      console.log(err);
    });
}
