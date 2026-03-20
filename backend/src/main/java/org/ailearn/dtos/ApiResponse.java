package org.ailearn.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;


@Getter
@Setter
@AllArgsConstructor
public class ApiResponse<T> {

    private boolean status;
    private String message;
    //	data
    private T data;
    //	error
    private Object error;


    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data, null);
    }

    public static <T> ApiResponse<T> failure(String message, Object error) {
        return new ApiResponse<>(false, message, null, error);
    }

}