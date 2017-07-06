<coolcomponent>
  <p>Seconds Elapsed: { time }</p>

  <script>
    this.time = opts.start || 0

    let coolVar = 0

    var timer = setInterval(this.tick, 1000)

    this.on('unmount', () => {
      clearInterval(timer)
    })
  </script>
</coolcomponent>
