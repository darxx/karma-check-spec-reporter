# karma-check-spec-reporter
Karma plugin for jasmine spec files duplication report.

Karma configuration:
<pre>
<code>
  plugins: [
      ...
      require('karma-check-spec-reporter'),
      ...
  ],
  ...
  reporters: ['checkSpec'],
  ...
</code>
</pre>
If duplication found:

![speck not found](found.PNG)

If duplication not found:

![speck not found](not-found.PNG)
