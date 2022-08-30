$(function () {
    const layer = layui.layer
    const form = layui.form
    //获取文章分类列表
    function getArticleList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                // 渲染表格
                const htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    getArticleList()
    let index = null
    $('#btnAddCate').click(function () {
        index = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })
    //通过代理为表单绑定提交事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    layer.close(index)
                    return layer.msg(res.message)

                }
                layer.msg(res.message)
                getArticleList()
                layer.close(index)
            }
        })
    })
    // 修改文章分类
    $('tbody').on('click', '.btn-edit', function () {
        index = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        const id = $(this).attr('data-id')
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })
    // 通过事件委托为修改绑定事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg(res.message)
                layer.close(index)
                getArticleList()
            }
        })
    })
    // 删除文章分类
    $('tbody').on('click', '.btn-delete', function () {
        const id = $(this).attr('data-id')
        layer.confirm(
            '是否删除?',
            {
                icon: 3, title: '提示'
            },
            function (index) {
                $.ajax({
                    method: 'get',
                    url: '/my/article/deletecate/' + id,
                    success: function (res) {
                        if (res.status !== 0) return layer.msg(res.message)
                        layer.msg(res.message)
                        getArticleList()
                    }
                })
                layer.close(index)
            })

    })
})