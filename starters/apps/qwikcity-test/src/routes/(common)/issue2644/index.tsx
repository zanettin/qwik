import { component$ } from '@builder.io/qwik';
import { action$, Form } from '@builder.io/qwik-city';
import { data } from './data';

export const rootAction = action$((form, { redirect }) => {
  const name = form.name as string;
  data.length = 0;
  data.push(name);
  throw redirect(303, '/qwikcity-test/issue2644/other/');
});

export default component$(() => {
  const action = rootAction.use();
  return (
    <Form action={action} spaReset>
      <input name="name" id="issue2644-input" />
      <button id="issue2644-submit">Submit</button>
    </Form>
  );
});
