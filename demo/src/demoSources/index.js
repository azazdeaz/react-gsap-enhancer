let demos = {
  'update-and-animate-transform': require('raw!./update-and-animate-transform.example'),
  'morphing-search-input': require('raw!./morphing-search-input.example'),
  'parrot-hover': require('raw!./parrot-hover.example'),
  'cow-jumps-over-the-moooooon': require('raw!./cow-jumps-over-the-moooooon.example'),
  'rainbow-rocket-man': require('raw!./rainbow-rocket-man.example'),
  'animate-list-with-stagger': require('raw!./animate-list-with-stagger.example'),
}

if (__WIP__) {
  demos = {
    ...demos,
    'remount-target': require('raw!./remount-target.example'),
  }
}

export default demos
  
