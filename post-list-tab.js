(function(wp) {
    const { __, sprintf } = wp.i18n;
    const { registerPlugin } = wp.plugins;
    const { PluginDocumentSettingPanel } = wp.editPost;
    const { Spinner, Button } = wp.components;
    const { withSelect } = wp.data;
    const { compose } = wp.compose;
    const { createElement, useEffect, useState, useCallback } = wp.element;
    const { apiFetch } = wp;

    function decodeHTMLEntities(text) {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }

    function PostListTab() {
        const [posts, setPosts] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState(null);

        useEffect(() => {
            const currentPostType = wp.data.select('core/editor').getCurrentPostType();
            const path = currentPostType === 'post' ? '/wp/v2/posts' : `/wp/v2/${currentPostType}`;

            apiFetch({
                path: `${path}?per_page=10&status=any`,
                method: 'GET'
            }).then(fetchedPosts => {
                setPosts(fetchedPosts);
                setIsLoading(false);
            }).catch(error => {
                console.error('Error fetching posts:', error);
                setError(__('Failed to load posts. Please try again.'));
                setIsLoading(false);
            });
        }, []);

        const handlePostClick = useCallback((postId) => {
            const editLink = `/wp-admin/post.php?post=${postId}&action=edit`;
            window.location.href = editLink;
        }, []);

        const handleNewPost = useCallback(() => {
            const currentPostType = wp.data.select('core/editor').getCurrentPostType();
            const newPostLink = `/wp-admin/post-new.php${currentPostType !== 'post' ? '?post_type=' + currentPostType : ''}`;
            window.location.href = newPostLink;
        }, []);

        if (isLoading) {
            return createElement(Spinner);
        }

        if (error) {
            return createElement('p', { className: 'error-message' }, error);
        }

        return createElement(
            PluginDocumentSettingPanel,
            {
                name: "post-list-tab",
                title: __("글 리스트"),
                icon: "list-view"
            },
            createElement(Button, {
                isPrimary: true,
                onClick: handleNewPost,
                className: 'new-post-button'
            }, __("새 페이지 생성")),
            createElement('ul', { className: 'post-list' },
                posts.map(post =>
                    createElement('li', {
                            key: post.id,
                            className: `post-list-item ${post.status}`,
                            onClick: () => handlePostClick(post.id),
                            onKeyPress: (event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                    handlePostClick(post.id);
                                }
                            },
                            tabIndex: 0,
                            role: 'button',
                            'aria-label': sprintf(__('Edit post: %s'), decodeHTMLEntities(post.title.rendered))
                        },
                        decodeHTMLEntities(post.title.rendered),
                        post.status !== 'publish' && createElement('span', { className: 'post-status' },
                            ` (${post.status === 'draft' ? '임시글' : post.status})`)
                    )
                )
            )
        );
    }

    const PostListTabComposed = compose([
        withSelect(() => ({}))
    ])(PostListTab);

    registerPlugin('post-list-tab', {
        render: PostListTabComposed,
        icon: 'list-view'
    });
})(window.wp);
