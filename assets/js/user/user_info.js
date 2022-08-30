$(function () {
    const form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6个字符之间'
            }
        }
    })
    const layer = layui.layer
    initUserInfo()
    function initUserInfo() {
        $.get({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)
                //快速给表单赋值
                //第一个参数为 lay-filter中的名字,第二个参数为数据库获取到的信息,会自动对应上
                form.val('formUserInfo', res.data)
            }
        })
    }
    // 重置表单数据
    $('[type=reset]').click(function (e) {
        e.preventDefault()
        initUserInfo()
    })
    //表单提交数据 并修改
    $('.layui-form').submit(function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg('修改信息成功')
                //调用父页面方法,重新渲染用户信息
                window.parent.getUserInfo()
            }
        })
    })
})