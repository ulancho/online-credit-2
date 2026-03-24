import { observer } from 'mobx-react-lite';

import Button from 'Common/components/Button/Button.tsx';
import { generatePdfLkd } from 'Modules/CreditCalculator/api/pdfLkdApi.ts';

const Test = () => {
  const handleClick1 = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (typeof window.deviceReport === 'function') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      window.deviceReport().then((response) => {
        alert(response);
      });
    }
  };

  const handleClick2 = () => {};

  const handleClick3 = async () => {
    await generatePdfLkd({ amount: 150000, termMonths: 12, nominalRate: 12 });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', paddingTop: '15px' }}>
      <Button onClick={handleClick1}>DeviceReport</Button>
      <Button onClick={handleClick2}>Loading byte</Button>
      <Button onClick={handleClick3}>Loading base64</Button>
    </div>
  );
};

export default observer(Test);
