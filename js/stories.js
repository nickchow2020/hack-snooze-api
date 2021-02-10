"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const loginUser = Boolean(currentUser)

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        ${loginUser ? showDelete(currentUser,story) : "" }
        ${loginUser ? showAndHideHeart(currentUser,story) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function showAndHideHeart(user,story){
  const isFavorite =  user.isFavorite(story)
  const favoriteType = isFavorite ? "fas" : "far"
  return `<i class="${favoriteType} fa-heart"></i>`
}

function showDelete(user,story){
  const isOwnStory = user.isOwnStory(story)
  if(isOwnStory){
    return `<i class="fas fa-trash-alt"></i>`
  }else{
    return ""
  }
}
/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}


async function handleFavoriteDeleteCallback(e){
  const $storyId = $(e.target).parent().attr("id")
  const $targetI = $(e.target)
  const response = await axios({
    method:"get",
    url:`${BASE_URL}/stories/${$storyId }`
  })
  const story = new Story(response.data.story)

  if($targetI.hasClass("fa-heart")){
    favoriteUi($targetI,story)
  }else{
    deleteUi($targetI,story)
  }
}


//function handle favorite UI
function favoriteUi(target,story){
  if(target.hasClass("far")){
    currentUser.addFavoriteStory(story)
    target.removeClass("far").addClass("fas")
  }else{
    currentUser.removeFavoriteStory(story)
    target.removeClass("fas").addClass("far")
  }
}

//function handle delete UI 
function deleteUi(target,story){
  currentUser.deleteMyStory(story)
  target.parent().remove()
}


$("#all-stories-list").on("click","i",handleFavoriteDeleteCallback)