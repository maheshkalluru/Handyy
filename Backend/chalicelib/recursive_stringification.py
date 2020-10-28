import uuid

def recursiveStringification(event):
    keys_to_remove = []
    ret_event = {}
    if type(event) not in [dict, list]:
        return event
    if type(event) == list:
        ret_event = event
        for k in range(len(event)):
            v = event[k]
            if type(v) == list:
                ret_event[k] = v
                for i in range(len(v)):
                    # ret_event[k][i] = checkifID(ret_event[k][i])
                    ret_event[k][i] = recursiveStringification(v[i])
            elif type(v) == dict:
                ret_event[k] = v
                for key, val in v.items():
                    ret_event[k][key] = recursiveStringification(val)
            else:
                if v == "":
                    keys_to_remove.append(k)
                else:
                    ret_event[k] = str(v)
    else:
        for k,v in event.items():
            if type(v) == list:
                ret_event[k] = v
                for i in range(len(v)):
                    # ret_event[k][i] = checkifID(ret_event[k][i])
                    ret_event[k][i] = recursiveStringification(v[i])
            elif type(v) == dict:
                ret_event[k] = v
                for key, val in v.items():
                    ret_event[k][key] = recursiveStringification(val)
            else:
                if v == "":
                    keys_to_remove.append(k)
                else:
                    ret_event[k] = str(v)
    return ret_event

def checkifID(intList):
    listId = 'id'
    if not (listId in intList):
        intList['id'] = str(uuid.uuid4()).replace("-","")
        
    return intList
