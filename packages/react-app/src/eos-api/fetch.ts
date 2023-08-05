import { api, contract } from "./config"

export interface IProps {
  actor?: string,
  permission?: "active" | "owner",
  action: string,
  data?: any,
}

export const pushAction = async (props: IProps) => {
  const {
    actor = contract,
    permission = "active",
    action,
    data,
  } = props
  try {
    const result = await api.transact(
      {
        actions: [
          {
            account: actor,
            name: action,
            authorization: [
              {
                actor,
                permission,
              },
            ],
            data,
          },
        ],
      },
      {
        blocksBehind: 3,
        expireSeconds: 30,
      }
    )
    return result
  } catch (error) {
    return {}
  }
}

export const add = (content: string) => pushAction({ action: "add", data: { content } }).then((res) => res)