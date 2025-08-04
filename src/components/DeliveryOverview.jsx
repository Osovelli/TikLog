import { CardComponent } from "./CardComponent";

export const DeliveryOverview = ({data}) => {
    /* const stats = [
      { title: 'All time', value: '205' },
      { title: 'Delivered', value: '200' },
      { title: 'Cancelled', value: '3' },
      { title: 'In Progress', value: '2' },
    ]; */


    const stats = [
      { title: 'All time', value: data?.allTime },
      { title: 'Delivered', value: data?.delivered },
      { title: 'Cancelled', value: data?.cancelled },
      { title: 'In Progress', value: data?.inProgress },
    ];
  
    return (
      <CardComponent
        title="Delivery Overview"
        action="This week"
        content={
          <div className="grid sm:grid-cols-4 grid-cols-2 gap-4 mt-4">
            {stats.map((stat, index) => (
              <div className="text-center bg-indigo-800 text-white rounded-lg p-4" key={index}>
                <p className="text-sm ">{stat.title}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
            ))}
          </div>
        }
        className="mb-6"
      />
    );
  };
  
