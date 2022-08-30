$(function () {
    const layer = layui.layer
    const form = layui.form
    const laypage = layui.laypage
    // 定义一个参数对象,用于请求数据
    let q = {
        pagenum: 1, //页码值
        pagesize: 2,    //每页多少条记录
        cate_id: '',    //文章分类的id
        state: ''       //文章的发布状态
    }
    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        let y = dt.getFullYear()
        let m = dt.getMonth() + 1
        let d = dt.getDate()
        let hh = dt.getHours()
        padZero(hh)
        let mm = dt.getMinutes()
        padZero(mm)
        let ss = dt.getSeconds()
        padZero(ss)
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
    //补零函数
    function padZero(n) {
        n > 9 ? n : '0' + n;
    }
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)
                //使用模板引擎渲染数据
                const htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    initTable()
    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)
                //调用模板引擎
                const htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //刚开始页面上并没有下拉框，layui.js渲染时
                //生成了一个空的下拉框,此时更新完后layui没有监听到
                //所以重新调用layui的渲染函数
                //通知layui,重新渲染表单区域的ui结构
                form.render()
            }
        })
    }
    initCate()
    //筛选
    $('#form-search').submit(function (e) {
        e.preventDefault()
        //获取选中的值
        const cate_id = $('[name=cate_id]').val()
        const state = $('[name=state]').val()
        //为查询参数对象重新赋值
        q.cate_id = cate_id
        q.state = state
        initTable()
    })
    /*定义渲染分页的方法 */
    function renderPage(total) {
        // 使用layui提供的分页渲染函数
        laypage.render({
            elem: 'pageBox',     //希望哪个容器进行分页渲染,是ID不用加#
            count: total,        //数据总条数
            limit: q.pagesize,   //每页条数
            curr: q.pagenum,     //默认被选中哪一页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //分页发生切换就会触发jump回调函数
            //jump触发的方式:
            //1.点击页码
            //2.调用了laypage.render
            //first参数解决死循环,first为true表明通过第二种方式触发
            //如果是第一种方式触发,则first为undefined
            jump: function (obj, first) {
                //obj.curr可以获取切换后的页码值
                q.pagenum = obj.curr
                //拿到最新的条目数
                q.pagesize = obj.limit
                // initTable()   直接调用会发生死循环
                //当点击页码触发,就调用渲染
                if (!first) initTable()
            }
        })
    }

    // 通过代理绑定删除时间
    $('tbody').on('click', '.btn-delete', function () {
        let length = $('.btn-delete').length
        const id = $(this).attr('data-id')
        layer.confirm('是否删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) return layer.msg(res.message)
                    layer.msg('删除成功!')
                    // 当数据删除完成,需要判断当前页面是否还有数据
                    //如果没有需要将页码值减一
                    // 判断页面上删除按钮的个数
                    if (length == 1) {
                        q.pagenum = q.pagenum > 1 ? q.pagenum-- : 1
                    }
                    initTable()
                }
            })

            layer.close(index)
        })
    })
})