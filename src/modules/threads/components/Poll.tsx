import { FC } from "react";
import { Col, Form, FormInstance, Input, Row } from "antd";
import clsx from "clsx";

interface PollProps {
  form: FormInstance<any>;
  name: number;
  onRemove: () => void;
}

const initialValue: { option: string }[] = [
  { option: "" },
  { option: "" },
  { option: "" },
];

export const Poll: FC<PollProps> = ({ form, name, onRemove }) => {
  const { threads } = form.getFieldsValue();
  const currentThread = threads[name];
  return (
    <div>
      <Form.List name={[name, "poll"]} initialValue={initialValue}>
        {(fields, { add }) => {
          return (
            <>
              {fields.map(({ key }) => (
                <Form.Item className="mb-2" key={key} name={[key, "option"]}>
                  <Input
                    placeholder={
                      key === 0
                        ? "Yes"
                        : key === 1
                        ? "No"
                        : "Add another option"
                    }
                    className={clsx(
                      "border border-slate-300",
                      fields.length - 1 === key &&
                        !currentThread.poll?.[key]?.option
                        ? "border-dashed"
                        : "border-solid"
                    )}
                    onChange={(e) => {
                      if (key >= 2) {
                        if (key === fields.length - 1) {
                          if (e.target.value) {
                            if (fields.length >= 4) {
                              return;
                            }
                            add({ option: "" });
                          } else {
                            const { poll } = currentThread;
                            if (poll?.[key - 1]?.option === "") {
                              Object.assign(currentThread, {
                                ...currentThread,
                                poll: poll.slice(0, -1),
                              });
                              form.setFieldsValue({ threads });
                            }
                          }
                        } else if (key === fields.length - 2) {
                          if (!e.target.value) {
                            const { poll } = currentThread;
                            Object.assign(poll[key], { option: "" });
                            const lastOption = poll?.[poll.length - 1].option;
                            Object.assign(currentThread, {
                              ...currentThread,
                              poll: lastOption ? poll : poll.slice(0, -1),
                            });
                            form.setFieldsValue({ threads });
                          }
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
      <Row justify="space-between" align="middle">
        <Col span="auto">
          <span className="text-xs text-[#999999]">Ends in 24h</span>
        </Col>
        <Col span="auto">
          <span
            className="text-xs text-[#999999] font-bold"
            onClick={() => {
              onRemove();
              Object.assign(currentThread, {
                ...currentThread,
                poll: initialValue,
              });
              form.setFieldsValue({ threads });
            }}
          >
            Remove poll
          </span>
        </Col>
      </Row>
    </div>
  );
};
