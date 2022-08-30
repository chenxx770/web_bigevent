$(function () {
    const layer = layui.layer
    const form = layui.form
    // 定义加载文章分类方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)
                const htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    initCate()
    initEditor()
    // 1. 初始化图片裁剪器
    const $image = $('#image')

    // 2. 裁剪选项
    const options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //点击选择封面,选择文件
    $('#btnChooseImage').click(function () {
        $('#coverFile').click()

    })
    $('#coverFile').change(function (e) {
        //获取选择的文件列表
        const files = e.target.files
        if (files.length === 0) return
        // 根据文件获取地址
        const imageURL = URL.createObjectURL(files[0])
        $image.
            cropper('destroy'). //销毁旧的裁剪区域
            attr('src', imageURL). // 重新设置图片路径
            cropper(options)  // 重新初始化裁剪区域
    })

    //定义发布状态
    let art_state = '已发布'
    //点击草稿点击事件
    $('#btnSave2').click(function () {
        art_state = '草稿'
    })
    $('#btnSave').click(function () {
        art_state = '已发布'
    })
    $('#form-pub').submit(function (e) {
        e.preventDefault()
        //基于form表单创建formdata对象快速获取表单的值
        const fd = new FormData($(this)[0])
        //将状态追加到formdata中
        fd.append('state', art_state)
        // 将封面裁剪后的图片输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件存储到fd中
                fd.append('cover_img', blob)
                // 发起ajax数据请求
                publishArticle(fd)
            })


    })
    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            // 如果向服务器提交的是formdata数据
            //必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) return layer.msg(res.message)
                location.href = './art_list.html'
            }
        })
    }
})