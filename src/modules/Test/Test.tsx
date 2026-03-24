import { observer } from 'mobx-react-lite';

import Button from 'Common/components/Button/Button.tsx';

const Test = () => {
  const handleClick = () => {
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

  return (
    <div>
      <Button onClick={handleClick}>Test</Button>
    </div>
  );
};

export default observer(Test);
