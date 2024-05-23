import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getUser } from "../../constants/user";
import MemberAPI from "../../service/member.service";
import moment from "moment";
import { toast } from "react-toastify";

function ReportKGList({ onEdit, f7, selected }) {
  const queryClient = useQueryClient();

  const Member = getUser();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["MembersNoteKG", selected],
    queryFn: async () => {
      const startOfMonth = moment(selected).subtract(3, 'month').format("MM/DD/YYYY");
      const endOfMonth = moment(selected).endOf("month").format("MM/DD/YYYY");
      const { data } = await MemberAPI.listNoteKg({
        pi: 1,
        ps: 100,
        filter: {
          MemberID: Member?.ID,
          CreateDate: [startOfMonth, endOfMonth],
        },
      });
      return data?.list || [];
    },
    enabled: Boolean(Member?.ID),
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (body) => MemberAPI.deleteNoteKg(body),
  });

  const onDelete = (item) => {
    f7.dialog.confirm("Bạn có chắc chắn muốn xóa ?", () => {
      f7.dialog.preloader("Đang thực hiện ...");
      deleteNoteMutation.mutate(
        { delete: [item.ID] },
        {
          onSuccess: () => {
            queryClient
              .invalidateQueries({ queryKey: ["MembersNoteKG"] })
              .then(() => {
                f7.dialog.close();
                toast.success("Xóa thành công.");
              });
          },
        }
      );
    });
  };

  window.KGReload = (fn) => refetch().then(() => fn && fn()).catch(er => console.log(er))

  return (
    <div className="h-100">
      <div className="bg-warning text-white px-15px py-10px font-size-sm">
        Cân nặng sáng nay của bạn là bao nhiêu? Hãy nhập số cân sáng nay để
        chúng tôi hỗ trợ bạn kịp thời nhé.
      </div>
      {isLoading && <div className="p-15px">Đang tải ...</div>}
      {!isLoading && (
        <>
          {data &&
            data.length > 0 &&
            data.map((item, index) => (
              <div
                className="p-15px border-bottom d-flex justify-content-between align-items-center"
                key={index}
                style={{
                  backgroundColor:
                    moment(item.CreateDate).format("DD/MM/YYYY") ===
                    moment().format("DD/MM/YYYY")
                      ? "rgb(255, 250, 223)"
                      : "",
                }}
              >
                <div>
                  <div className="text-muted font-size-sm">
                    {moment(item.CreateDate).format("DD/MM/YYYY")}
                  </div>
                  <div className="fw-700">{item.Value} Kg</div>
                </div>
                <div className="d-flex">
                  <div
                    className="w-32px h-32px bg-success rounded-circle text-white d-flex justify-content-center align-items-center"
                    onClick={() => onEdit(item)}
                  >
                    <i className="las la-pen font-size-md"></i>
                  </div>
                  <div
                    className="w-32px h-32px bg-danger rounded-circle text-white d-flex justify-content-center align-items-center ml-8px"
                    onClick={() => onDelete(item)}
                  >
                    <i className="las la-trash font-size-md"></i>
                  </div>
                </div>
              </div>
            ))}
          {(!data || data.length === 0) && (
            <div className="p-15px">Chưa có dữ liệu</div>
          )}
        </>
      )}
    </div>
  );
}

export default ReportKGList;
