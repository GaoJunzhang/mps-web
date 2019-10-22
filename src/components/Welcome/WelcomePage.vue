<template>
  <div class="welcome">
    <div class="img">
      <img src="https://gw.alipayobjects.com/zos/rmsportal/wZcnGqRDyhPOEYFcZDnb.svg"/>
    </div>
    <div class="content">
      <h1>欢迎回来</h1>
      <div class="desc"></div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Welcome'
}
</script>

<style lang="less" scoped>
  .welcome {
    min-height: 500px;
    height: 80%;
    align-items: center;
    text-align: center;
    margin-top: 100px;
    .img {
      display: inline-block;
      padding-right: 52px;
      zoom: 1;
      img {
        height: 360px;
        max-width: 430px;
      }
    }
    .content {
      display: inline-block;
      flex: auto;
      h1 {
        color: #434e59;
        font-size: 72px;
        font-weight: 600;
        line-height: 72px;
        margin-bottom: 24px;
      }
      .desc {
        color: rgba(0, 0, 0, .45);
        font-size: 20px;
        line-height: 28px;
        margin-bottom: 16px;
      }
    }
  }

  .mobile {
    .welcome {
      margin-top: 30px;
      .img {
        padding-right: unset;

        img {
          height: 40%;
          max-width: 80%;
        }
      }
    }
  }
</style>
