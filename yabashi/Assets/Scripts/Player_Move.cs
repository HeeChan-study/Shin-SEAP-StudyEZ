using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public class Player_Move : MonoBehaviour
{
    public float Speed=0.01f;
    public int FirstPlayer_HP;
    public int Bom_Counter=5;
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        Vector2 pos = this.transform.position;
        
        if(Input.GetKey(KeyCode.W)){
            pos.y+=Speed;
            Debug.Log("w");
        }
        if(Input.GetKey(KeyCode.S)){
            pos.y-=Speed;
            Debug.Log("s");
        }
        if(Input.GetKey(KeyCode.D)){
            pos.x+=Speed;
            Debug.Log("d");
        }
        if(Input.GetKey(KeyCode.A)){
            pos.x-=Speed;
            Debug.Log("a");
        }
        if(Input.GetKey(KeyCode.Space)){
            Bom_Counter=Bom_Counter-1;
            Debug.Log("bom");
        }
        this.transform.position = pos;
    }

        
}
