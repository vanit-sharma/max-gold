var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bzBollywoodVirtualRatesOddSchema = new Schema({
  cat_mid: { type: String, required: true },
  sid: { type: String, required: true },
  rnr: { type: String, required: true },
  back: { type: Number, required: true },
  lay: { type: Number, required: true },
  status: { type: Number, required: true },
  updatedat: { type: Date, required: true }
}, {
  collection: 'bz_bollywood_virtual_rates_odd'
});

bzBollywoodVirtualRatesOddSchema.index({ cat_mid: 1 });
bzBollywoodVirtualRatesOddSchema.index({ sid: 1 });

module.exports = mongoose.model('BzBollywoodVirtualRatesOdd', bzBollywoodVirtualRatesOddSchema);
