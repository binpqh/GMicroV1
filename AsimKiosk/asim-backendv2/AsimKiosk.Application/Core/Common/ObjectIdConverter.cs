using MongoDB.Bson;

namespace AsimKiosk.Application.Core.Common;

public static class ObjectIdConverter
{
    public static List<ObjectId> Convert(List<string> ids)
    {
        var objectIdList = new List<ObjectId>();
        ids.ForEach(id =>
        {
            objectIdList.Add(ObjectId.Parse(id));
        });
        return objectIdList;
    }
}
