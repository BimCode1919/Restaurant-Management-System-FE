import { Staff } from "../types"

interface Props {
  staff: Staff[]
  loading: boolean
  onDelete: (id: number) => void
}

const StaffView = ({ staff = [], loading, onDelete }: Props) => {
  return (
    <div>

      <h2>Staff Management</h2>

      {loading && <p>Loading...</p>}

      {!loading && staff.length === 0 && <p>No staff found</p>}

      <table
        style={{
          borderCollapse: "collapse",
          width: "100%"
        }}
      >
        <thead>
          <tr>
            <th style={{ padding: 8 }}>ID</th>
            <th style={{ padding: 8 }}>Name</th>
            <th style={{ padding: 8 }}>Email</th>
            <th style={{ padding: 8 }}>Role</th>
            <th style={{ padding: 8 }}>Action</th>
          </tr>
        </thead>

        <tbody>

          {staff.map((s) => (
            <tr key={s.id}>
              <td style={{ padding: 8 }}>{s.id}</td>
              <td style={{ padding: 8 }}>{s.fullName}</td>
              <td style={{ padding: 8 }}>{s.email}</td>
              <td style={{ padding: 8 }}>{s.role}</td>

              <td style={{ padding: 8 }}>
                <button style={{ marginRight: 8 }}>
                  Edit
                </button>

                <button onClick={() => onDelete(s.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  )
}

export default StaffView