const bcrypt = require('bcryptjs');
const hash = '$2a$12$k3x2aR1k8oMo4V7d5A0tvOXoahFdFM94EBKq2h3dmgWLQcbE7aRIS';
bcrypt.compare('1', hash).then((res) => {
  console.log('Matches "1":', res);
});
bcrypt.compare('admin', hash).then((res) => {
  console.log('Matches "admin":', res);
});
bcrypt.compare('123456', hash).then((res) => {
  console.log('Matches "123456":', res);
});
