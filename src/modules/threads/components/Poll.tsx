import { Form, Input } from "antd";

export const Poll = () => {
  return (
    <Form>
      <Input placeholder="Yes" />
      <Input placeholder="No" />
      <Form.List name="poll" initialValue={[{ option: "" }]}>
        {(fields, { remove, add }) => {
          return (
            <>
              {fields.map(({ key, name }) => (
                <Form.Item className="!mb-0" key={key} name={[name, "option"]}>
                  <Input
                    placeholder={`${key} ${name}`}
                    variant="filled"
                    onChange={(e) => {
                      if (name === fields.length - 1) {
                        if (e.target.value) {
                          if (fields.length >= 3) {
                            return;
                          }
                          add({ option: "" });
                        } else {
                          remove(name + 1);
                        }
                      }
                    }}
                  />
                </Form.Item>
              ))}
            </>
          );
        }}
      </Form.List>
    </Form>
  );
};
