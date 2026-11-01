//maybe sample initial state with let topics = ["",]
//and let posts = [ {topic:"", text:""}] etc
let topics = ["software issues", "new tool help"];

let posts = [
    {
        topic: "software issues",
        title: "Filing system bug",
        text: "I believe theres a bug in our filing system. Whenever I try uploading a document, the website crashes and I have to restart it.",

        comments: [
            {
                username: "Alex",
                text: "I've noticed this issue too. It seems to happen when uploading files.",
                time: "10:32"
            },
            {
                username: "Sarah",
                text: "I'll look into this and see what's causing it.",
                time: "11:05"
            }
        ]
    },

    {
        topic: "new tool help",
        title: "Spreadsheet help",
        text: "Can someone explain our new spreadsheet tool to me? I'm struggling with some of the features.",

        comments: [
            {
                username: "James",
                text: "I can help! What exactly are you struggling with?",
                time: "09:15"
            }
        ]
    }

];


let activeTopic = null;   // null = show all topics
let searchQuery = '';

let activePostIndex = null;


const topicForm = document.getElementById('topic-form');
const topicInput = document.getElementById('topic-input');
const topicList = document.getElementById('topic-list');
const topicFilters = document.getElementById('topic-filters');
const topicModal = document.getElementById('topic-modal');
const newTopicBtn = document.getElementById('new-topic-btn');
const cancelTopicBtn = document.getElementById('cancel-topic-btn');
const searchInput = document.getElementById('search-input');
const kbMeta = document.getElementById('kb-meta');
const postTopicSelect = document.getElementById('post-topic');

const postsContainer = document.getElementById('posts-container');

const createPostBtn = document.getElementById('create-post-btn');
const postModal = document.getElementById('post-modal');
const postForm = document.getElementById('post-form');

const postTitle = document.getElementById('post-title');
const postContent = document.getElementById('post-content');
const cancelPostBtn = document.getElementById('cancel-post-btn');

const viewPostModal = document.getElementById('view-post-modal');
const closePostBtn = document.getElementById('close-post-btn');

const detailTopic = document.getElementById('detail-topic');
const detailTitle = document.getElementById('detail-title');
const detailContent = document.getElementById('detail-content');

const commentsHeading = document.getElementById('comments-heading');
const commentsContainer = document.getElementById('comments-container');

const commentForm = document.getElementById('comment-form');
const commentInput = document.getElementById('comment-input');

function renderMeta() {
    kbMeta.textContent = topics.length + ' topics \u00b7 ' + posts.length + ' posts';
}

function renderTopics() {
    renderMeta();

    // "All" chip
    topicFilters.innerHTML = '';
    const allChip = document.createElement('button');
    allChip.type = 'button';
    allChip.className = 'chip' + (activeTopic === null ? ' is-on' : '');
    allChip.textContent = 'All';
    allChip.addEventListener('click', () => {
        activeTopic = null;
        renderTopics();
        renderPosts();
    });
    topicFilters.appendChild(allChip);

    // topic cards with post counts
    topicList.innerHTML = '';

    if (topics.length === 0) {
        topicList.innerHTML = '<p class="subtitle">No topics created yet.</p>';
        return;
    }

    topics.forEach(topic => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'topic-card' + (topic === activeTopic ? ' is-on' : '');

        const name = document.createElement('strong');
        name.textContent = topic;

        const count = document.createElement('span');
        count.className = 'topic-count';
        count.textContent = posts.filter(p => p.topic === topic).length;

        card.appendChild(name);
        card.appendChild(count);

        card.addEventListener('click', () => {
            activeTopic = topic;
            renderTopics();
            renderPosts();
        });

        topicList.appendChild(card);
    });
}


function renderPosts() {

    postsContainer.innerHTML = '';

    const query = searchQuery.toLowerCase();

    const filteredPosts = posts.filter(post => {
        const matchesTopic = activeTopic === null || post.topic === activeTopic;
        const matchesSearch = !query ||
            post.title.toLowerCase().includes(query) ||
            post.text.toLowerCase().includes(query);
        return matchesTopic && matchesSearch;
    });

    if (filteredPosts.length === 0) {
        postsContainer.innerHTML = '<p class="subtitle">No posts found.</p>';
        return;
    }

    filteredPosts.forEach(post => {

        const index = posts.indexOf(post);

        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        postCard.tabIndex = 0;

        const tags = document.createElement('div');
        tags.className = 'tags';
        const tag = document.createElement('span');
        tag.className = 'tag tag-' + (topics.indexOf(post.topic) % 4);
        tag.textContent = post.topic;
        tags.appendChild(tag);

        const title = document.createElement('h3');
        title.textContent = post.title;

        const preview = document.createElement('p');
        preview.textContent = post.text.length > 100
            ? post.text.substring(0, 100) + '...'
            : post.text;

        const meta = document.createElement('span');
        meta.className = 'post-meta';
        const n = post.comments.length;
        meta.textContent = n + (n === 1 ? ' reply' : ' replies');

        postCard.appendChild(tags);
        postCard.appendChild(title);
        postCard.appendChild(preview);
        postCard.appendChild(meta);

        postCard.addEventListener('click', () => openPost(index));
        postCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') openPost(index);
        });

        postsContainer.appendChild(postCard);
    });
}

function openPost(index) {
    activePostIndex = index;
    const post = posts[index];

    detailTopic.textContent = '[' + post.topic + ']';
    detailTitle.textContent = post.title;
    detailContent.textContent = post.text;

    renderComments();

    viewPostModal.hidden = false;
}

function renderComments() {
    commentsContainer.innerHTML = '';
    const post = posts[activePostIndex];

    commentsHeading.textContent = 'Comments (' + post.comments.length + ')';

    if (post.comments.length === 0) {
        commentsContainer.innerHTML = '<p class="subtitle">No comments yet.</p>';
        return;
    }

    post.comments.forEach(comment => {
        const commentBox = document.createElement('div');
        commentBox.className = 'comment-box';

        const username = document.createElement('strong');
        username.textContent = comment.username;

        const time = document.createElement('span');
        time.className = 'comment-time';
        time.textContent = comment.time;

        const text = document.createElement('p');
        text.textContent = comment.text;

        const commentHeader = document.createElement('div');
        commentHeader.className = 'comment-header';
        commentHeader.appendChild(username);
        commentHeader.appendChild(time);

        commentBox.appendChild(commentHeader);
        commentBox.appendChild(text);
        
        commentsContainer.appendChild(commentBox);
    });
}

commentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newCommentText = commentInput.value.trim();

    if (!newCommentText) {
        return;
    }

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newComment = {
        username: "user1", 
        text: newCommentText,
        time: currentTime
    };

    posts[activePostIndex].comments.push(newComment);

    commentInput.value = '';

    renderComments()
    renderPosts();
});

function closeViewPost() {
    viewPostModal.hidden = true;
    activePostIndex = null;
    commentForm.reset();
}


createPostBtn.addEventListener('click', () => {

    if (topics.length === 0) {
        alert("Please create a topic first.");
        return;
    }

    postTopicSelect.innerHTML = '';
    topics.forEach(topic => {
        const option = document.createElement('option');
        option.value = topic;
        option.textContent = topic;
        if (topic === activeTopic) option.selected = true;
        postTopicSelect.appendChild(option);
    });

    postModal.hidden = false;
});

function closePostPopup() {
    postModal.hidden = true;
    postForm.reset();
}

cancelPostBtn.addEventListener('click', () => {
    closePostPopup();
});


postModal.addEventListener('click', (e) => {
    if (e.target === postModal) {
        closePostPopup();
    }
});


postForm.addEventListener('submit', (e) => {

    e.preventDefault();

    const newTitle = postTitle.value.trim();
    const newContent = postContent.value.trim();

    if (!newTitle || !newContent) {
        alert("Please fill in both the title and content.");
        return;
    }

    const newPost = {
        topic: postTopicSelect.value,
        title: newTitle,
        text: newContent,
        comments: []
    };

    posts.unshift(newPost);

    renderTopics();
    renderPosts();

    closePostPopup();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (!viewPostModal.hidden) {
            closeViewPost();
        } else if (!postModal.hidden) {
            closePostPopup();
        } else if (!topicModal.hidden) {
            closeTopicPopup();
        }
    }
});

closePostBtn.addEventListener('click', () => {
    closeViewPost();
});

viewPostModal.addEventListener('click', (e) => {

    if (e.target === viewPostModal) {
        closeViewPost();
    }

});

topicForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newTopic = topicInput.value.trim();

    if (newTopic && !topics.includes(newTopic)) {
        topics.push(newTopic);
        activeTopic = newTopic;
        closeTopicPopup();
        renderTopics();
        renderPosts();
    }
});

function closeTopicPopup() {
    topicModal.hidden = true;
    topicForm.reset();
}

newTopicBtn.addEventListener('click', () => {
    topicModal.hidden = false;
    topicInput.focus();
});
cancelTopicBtn.addEventListener('click', closeTopicPopup);
topicModal.addEventListener('click', (e) => {
    if (e.target === topicModal) closeTopicPopup();
});

searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.trim();
    renderPosts();
});

renderTopics();
renderPosts();