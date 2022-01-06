import { api, rpc, contract } from "./config"

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
  console.log(actor, permission, action, data)
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
    console.log('获取到结果', result)
    return result
  } catch (error) {
    console.log('错误', error)
    return {}
  }
}

export const getTableData = async (table: string, pageKey: string, pageSize: number) => {
  try {
    const res = await rpc.get_table_rows({
      json: true,
      code: contract,
      scope: contract,
      table,
      limit: pageSize,
      reverse: true,
      key_type: 'i64',
      upper_bound: pageKey,  //索引参数的上限是什么
      index_position: 1  //使用的主索引
    })
    console.log('获取到结果', res)
    return res
  } catch (error) {
    console.log('错误', error)
    return {} as { rows: any }
  }
}

export const add = (content: string) =>
  pushAction({ action: "add", data: { content } })
    .then((res) => {
      return res
    })

export const done = (id: string) =>
  pushAction({ action: "done", data: { id } })
    .then((res) => {
      return res
    })

export const remove = (id: string) =>
  pushAction({ action: "remove", data: { id } })
    .then((res) => {
      return res
    })

export const getTableDataList = async (next_key: "", pageSize: number) => {
  const res = await getTableData('todotable', next_key, pageSize);
  if (res?.rows) {
    console.log(res?.rows)
  }
  return {}
}