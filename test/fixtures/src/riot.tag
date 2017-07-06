<coolcomponent>
  <p>Seconds Elapsed: { time }</p>

  <script>
    this.time = opts.start || 0

    function add (a,b) {
      return a + b;
    }

    tick () {
      this.update({ time: ++this.time })
    }

    var timer = setInterval(this.tick, 1000)

    this.on('unmount', function() {
      clearInterval(timer)
    })
  </script>
</coolcomponent>
