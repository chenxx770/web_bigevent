$(function () {
    const layer = layui.layer
    // 调用获取用户信息函数
    getUserInfo()
    $('#btnLogout').click(function () {
        //提示用户是否确认退出
        layer.confirm('是否确定退出', {
            icon: 3, title: '提示'
        },
            function (index) {
                // 清空token
                localStorage.removeItem('token')
                location.href = 'login.html'
                // 关闭confirm询问框
                layer.close(index)
            })
    })
})

//获取用户的请求信息
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        //headers就是请求头部
        headers: {
            Authorization: localStorage.getItem('token') || ''
        },
        success: function (res) {
            if (res.status !== 0) return layui.layer.msg(res.message)
            //调用渲染用户头像函数
            renderAvatar(res.data)
        },
        complete: function (res) {
            console.log(res);
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 1. 强制清空token
                localStorage.removeItem('token')
                // 2. 强制跳转到登录页面
                location.href = 'login.html'
            }
        }
    })
}
//渲染头像 
function renderAvatar(user) {
    //1. 如果昵称不存在,就渲染为登录名
    let name = user.nickname || user.username
    //2. 渲染欢迎文本
    $('#welcome').text(`欢迎,${name}`)
    // 3.按需求渲染用户头像
    if (user.user_pic !== null) {
        //3.1渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        //3.2渲染文本头像
        $('.layui-nav-img').hide()
        $('.text-avatar').show()
        //获取名称的第一个字符并转换为大写
        let first = name[0].toUpperCase()
        $('.text-avatar').text(first).show()
    }
}