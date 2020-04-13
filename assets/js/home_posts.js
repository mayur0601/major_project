{
    //method to submit the form data for new post using AJAX
    let createPost = function () {
        let newPostform = $('#new-post-form');

        newPostform.submit(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostform.serialize(),
                success: function (data) {
                    let newPost = newPostDom(data.data.post);
                    $('#post-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));

                    // call the create comment class
                    new PostComments(data.data.post._id);

                    // CHANGE :: enable the functionality of the toggle like button on the new post
                    new ToggleLike($(' .toggle-like-button', newPost));

                    new Noty({
                        theme: 'relax',
                        text: "Post Created!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();

                }, console, error: function (error) {
                    console.log(error.responseText);
                }

            })
        });
    }

    //method to create a post using DOM
    let newPostDom = function (post) {
        return $(`<li id="post-${post._id}">
                <p>
                    
                    <small>
                        <a class="delete-post-button" href="/posts/destroy/${post._id}"> X </a>
                    </small>
            
                    ${ post.content}
                    <br>
                    <small>
                        ${ post.user.name}
                    </small>
                    <br>
                    <small>
                        
                            <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                                0 Likes
                            </a>
                        
                    </small>
                </p>
                <div class="post-comments">
                  
                        <form action="/comments/create" method="POST">
                        <input type="text" name="content" placeholder="Type Here to add comment..." required>
                        <input type="hidden" name="post" value="${ post._id}" >
                        <input type="submit" value="Add Comment">
            
                        </form>
                       
            
                        <div class="post-comments-list">
                            <ul id="post-comments-${ post._id}">
            
                            </ul>  
                       </div>
                </div>
            </li>`)
    }




    //  method to delete a post from DOM
    let deletePost = function (deleteLink) {
        $(deleteLink).click(function (e) {
            e.preventDefault();


            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {
                    $(`#post-${data.data.post_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();

                }, error: function (error) {
                    console.log(error.responseText);
                }
            })
        });

    }

    let convertPostsToAjax = function(){
        $('#post-list-container>ul>li').each(function(){
            let self = $(this); // ye this kya waapis lara h 
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);  // ye kb kaam krega jb mei click krunga tb

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]   // ye function kaam kese krra h
            new PostComments(postId);
            //kya h class postcomments public hai , yaha kese show hori h 
        });
    }

    createPost();
    convertPostsToAjax();
}