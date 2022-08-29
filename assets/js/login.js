$(function () {
  //点击去注册按钮连接
  $('#link_reg').click(function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })
  //点击去登录按钮连接
  $('#link_login').click(function () {
    $('.login-box').show()
    $('.reg-box').hide()
  })
  // 从layui中获取form对象
  const form = layui.form
  const layer = layui.layer
  //通过form.verify()定义校验规则
  form.verify({
    //自定义了一个叫做pwd的校验规则
    pwd: [
      /^[\S]{6,12}$/,
      '密码必须6到12位,且不能出现空格'
    ],
    //校验两次密码是否一致
    repwd: function (value) {
      //通过形参拿到的是调用此验证的框的值
      let password = $('.reg-box [name=password]').val()
      if (password !== value) {
        return '两次输入密码不一致,请重新输入'
      }
    }
  })

  // 监听表单注册
  $('#form_reg').submit(function (e) {
    e.preventDefault()
    const data = {
      username: $('#form_reg [name=username]').val(),
      password: $('#form_reg [name=password]').val(),
    }
    // 发起ajax请求
    $.post('/api/reguser',
      data, function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        } else {

          layer.msg(res.message)
          $('#link_login').click()
        }
      })
  })
  $('#form_login').submit(function (e) {
    e.preventDefault()
    $.ajax({
      method: 'post',
      url: '/api/login',
      data: $(this).serialize(),
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg(res.message)
        //将身份认证信息token存入本地存储,方便后续认证
        localStorage.setItem('token', res.token)
        location.href = '/index.html'
      }
    })
  })



})