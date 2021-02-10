"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

//when user is click on the submit button,show add story form and do logic with 
//form submission

async function handleAddStorySubmission(e){
  e.preventDefault()
  const token = currentUser.loginToken
  const title = $("#add_title").val()
  const author = $("#add_author").val()
  const url = $("#add_url").val()

  const response = await axios({
    method: "post",
    url: `${BASE_URL}/stories`,
    data:{
      token,
      story:{title,author,url}
    }
  })

  const newStory = new Story(response.data.story)
  storyList.stories.unshift(newStory)
  location.reload()
}

$("#addStoryForm").on("submit",handleAddStorySubmission)

//show and show the add story submission function
function showAddStoryForm(){
  $("#form_add_story").toggle("slow")
}
$("#addStory").on("click",showAddStoryForm)


function handleFavoriteStories(){
  currentUser.handleUserFavorite()
}
$("#favoriteStories").on("click",handleFavoriteStories)


function handleMyOwnStories(){
  currentUser.showMyStories()
}

$("#myOwnStories").on("click",handleMyOwnStories)